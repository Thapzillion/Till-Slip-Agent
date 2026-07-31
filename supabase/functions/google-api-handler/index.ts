import { GoogleGenAI } from "npm:@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_INSTRUCTIONS = `
You are RuachAgent AI, an intelligent till slip engine. 
When the user sends a prompt, analyze their intent and respond ONLY with a raw JSON object (no markdown, no backticks).

JSON Format:
{
  "chatResponse": "Brief text confirmation or explanation to show in the chat window.",
  "receiptData": {
    "theme": "brandie-cyber" | "minimalist-thermal" | "neon-glow",
    "merchantName": "Store Name",
    "location": "City, Country",
    "items": [
      { "name": "Item name", "price": "R0.00" }
    ],
    "vat": "R0.00",
    "total": "R0.00",
    "accentColor": "#00f0ff"
  }
}
`;

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    const response = await ai.create({
      model: "gemini-2.5-flash",
      contents: [
        { role: "user", parts: [{ text: SYSTEM_INSTRUCTIONS }] },
        { role: "user", parts: [{ text: prompt }] }
      ]
    });

    // Parse AI output as JSON
    const parsedData = JSON.parse(response.output_text);
    return Response.json(parsedData);
  } catch (error) {
    console.error("AI Error:", error);
    return Response.json({ error: "Failed to parse AI response" }, { status: 500 });
  }
}