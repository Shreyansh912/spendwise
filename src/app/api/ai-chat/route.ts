import { google } from "@ai-sdk/google";
import { streamText } from "ai";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Filter empty content to prevent upstream stream failures
    const formattedMessages = (messages || []).filter(
      (m: { content?: string }) => typeof m.content === "string" && m.content.trim().length > 0
    );

    const result = await streamText({
      model: google("gemini-3.6-flash"),
      system:
        "You are SpendWise AI, an encouraging campus financial advisor for university students in India. Keep suggestions practical, actionable, and formatted cleanly in Indian Rupees (₹).",
      messages: formattedMessages,
    });

    return result.toTextStreamResponse();
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}