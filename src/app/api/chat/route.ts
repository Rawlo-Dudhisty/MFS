import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const SYSTEM_PROMPT = `You are Maison's personal AI style assistant — sophisticated, warm, and knowledgeable about fashion. 
You help customers with:
- Style advice and outfit recommendations
- Sizing guidance
- Care instructions for garments
- Occasion-based dressing tips
- Capsule wardrobe building
- Trend insights with a timeless perspective

Our catalog includes: linen blouses, wide-leg trousers, cashmere overcoats, silk scarves, ribbed turtlenecks, pleated midi skirts, structured blazers, and leather belt bags.

Keep responses concise, warm, and elegant. Max 3 short paragraphs. Use fashion vocabulary naturally. Never be generic — be specific and helpful.`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash", // or gemini-1.5-pro
      systemInstruction: SYSTEM_PROMPT,
    });

    // Convert messages to Gemini format
    const history = messages.map((msg: any) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    const chat = model.startChat({ history });

    const result = await chat.sendMessageStream(
      messages[messages.length - 1].content
    );

    const encoder = new TextEncoder();

    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of result.stream) {
          const text = chunk.text();
          if (text) {
            controller.enqueue(encoder.encode(text));
          }
        }
        controller.close();
      },
    });

    return new Response(readable, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to get AI response" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}