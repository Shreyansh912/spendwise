import { google } from "@ai-sdk/google";
import { generateText } from "ai";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { imageBase64 } = await req.json();

    if (!imageBase64) {
      return new Response(JSON.stringify({ error: "No image payload provided" }), {
        status: 400,
      });
    }

    const prompt = `Analyze this receipt or bill image. Extract these exact details and return ONLY a valid JSON object without markdown fences:
{
  "description": "Short summary of the vendor or items",
  "amount": number,
  "category": "Canteen / Mess" | "Academics / Books" | "Outings & Travel" | "Hostel Supplies" | "Allowance / Stipend" | "Other"
}`;

    const { text } = await generateText({
      model: google("gemini-3.6-flash"),
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            { type: "image", image: imageBase64 },
          ],
        },
      ],
    });

    const cleanJson = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(cleanJson);

    return new Response(JSON.stringify(parsed), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error scanning receipt";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}