import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { products } from "@/lib/products";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { productId, cartItems } = await req.json();

    const currentProduct = products.find(p => p.id === productId);

    const catalog = products.map(p => ({
      id: p.id,
      name: p.name,
      category: p.cat,
      price: p.price,
      tags: p.tags,
      description: p.description,
    }));

    const prompt = `You are a fashion stylist AI. Given the context below, recommend exactly 3 complementary products.

Current product being viewed: ${JSON.stringify(currentProduct)}
Items already in cart: ${JSON.stringify(
      cartItems?.map((c: { id: number; name: string; category: string }) => ({
        id: c.id,
        name: c.name,
        category: c.category,
      })) || []
    )}

Full catalog (pick 3 IDs that best complement — exclude the current product and cart items if possible):
${JSON.stringify(catalog)}

Respond ONLY with valid JSON in this exact format:
{
  "recommendations": [
    { "id": <number>, "reason": "<one short sentence why it pairs well>" },
    { "id": <number>, "reason": "<one short sentence>" },
    { "id": <number>, "reason": "<one short sentence>" }
  ]
}`;

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash", // fast + cheap
    });

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Clean markdown if Gemini adds ```json
    const cleaned = text.replace(/```json|```/g, "").trim();

    const { recommendations } = JSON.parse(cleaned);

    const enriched = recommendations
      .map(({ id, reason }: { id: number; reason: string }) => ({
        ...products.find(p => p.id === id),
        reason,
      }))
      .filter(Boolean);

    return NextResponse.json({ recommendations });

  } catch (error) {
    // Fallback
    const fallback = products
      .slice(0, 3)
      .map(p => ({
        ...p,
        reason: "Pairs beautifully with your selection.",
      }));

    return NextResponse.json({ recommendations: fallback });
  }
}