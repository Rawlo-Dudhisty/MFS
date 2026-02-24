import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { products } from "@/lib/products";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();

    if (!query?.trim()) {
      return NextResponse.json({ results: products, interpretation: "" });
    }

    const catalog = products.map(p => ({
      id: p.id,
      name: p.name,
      category: p.cat,
      tags: p.tags,
      price: p.price,
      description: p.description,
    }));

    const prompt = `You are a fashion search AI. A customer searched: "${query}"

Product catalog:
${JSON.stringify(catalog)}

Analyze the search intent and return matching product IDs ranked by relevance. Also write a short, natural interpretation of what the customer is looking for.

Respond ONLY with valid JSON:
{
  "ids": [<array of product ids, most relevant first>],
  "interpretation": "<1 sentence describing what you understood they want>"
}`;

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json", // 🔥 ensures clean JSON
      },
    });

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const cleaned = text.replace(/```json|```/g, "").trim();
    const { ids, interpretation } = JSON.parse(cleaned);

    const results = ids
      .map((id: number) => products.find(p => p.id === id))
      .filter(Boolean);

    return NextResponse.json({ results, interpretation });

  } catch (error) {
    return NextResponse.json({ results: products, interpretation: "" });
  }
}