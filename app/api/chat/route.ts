import { NextResponse } from "next/server";
import { generateAssistantReply } from "@/lib/openai";
import { detectLeadIntent } from "@/lib/lead-detection";

export const runtime = "nodejs";

function sanitizeHistory(
  history: unknown,
): { role: "user" | "assistant"; content: string }[] {
  if (!Array.isArray(history)) {
    return [];
  }

  return history
    .filter(
      (message): message is { role: "user" | "assistant"; content: string } =>
        (message?.role === "user" || message?.role === "assistant") &&
        typeof message.content === "string",
    )
    .map((message) => ({
      role: message.role,
      content: message.content.trim(),
    }))
    .filter((message) => message.content.length > 0);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      message?: unknown;
      history?: unknown;
    };

    const message = typeof body.message === "string" ? body.message.trim() : "";

    if (!message) {
      return NextResponse.json(
        { error: "Message is required." },
        { status: 400 },
      );
    }

    const result = await generateAssistantReply(
      message,
      sanitizeHistory(body.history),
    );

    return NextResponse.json({
      reply: result.reply,
      mode: result.mode,
      leadIntent: detectLeadIntent(message),
    });
  } catch (error) {
    console.error("Chat route failed", error);

    return NextResponse.json(
      { error: "Unable to generate a reply." },
      { status: 500 },
    );
  }
}
