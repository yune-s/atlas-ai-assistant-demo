import OpenAI from "openai";
import { generateFallbackReply, generateStructuredReply } from "@/lib/fallback-ai";
import { getKnowledgeBaseText } from "@/lib/knowledge";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const systemPrompt = `You are a helpful assistant for Atlas Digital Academy in Morocco.
Reply in the same language as the user when possible.
Support French, Arabic, English, and Moroccan Darija.
Be short, polite, and business-oriented.
Use only the knowledge base provided below.
Do not invent unavailable information.
For prices, ask the user to leave their phone number.
For registration, collect: full name, phone number, course of interest, and city.
For complex questions or anything outside the knowledge base, say a human advisor will contact them.

Knowledge base:
${getKnowledgeBaseText()}`;

export async function generateAssistantReply(
  message: string,
  history: ChatMessage[] = [],
) {
  const structuredReply = generateStructuredReply(message, history);

  if (structuredReply) {
    return {
      reply: structuredReply,
      mode: "local-faq" as const,
    };
  }

  if (!process.env.OPENAI_API_KEY) {
    return {
      reply: generateFallbackReply(message, history),
      mode: "local-fallback" as const,
    };
  }

  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      temperature: 0.2,
      messages: [
        { role: "system", content: systemPrompt },
        ...history.slice(-8),
        { role: "user", content: message },
      ],
    });

    return {
      reply:
        completion.choices[0]?.message.content?.trim() ||
        generateFallbackReply(message, history),
      mode: "openai" as const,
    };
  } catch (error) {
    console.error("OpenAI request failed", error);

    return {
      reply: generateFallbackReply(message, history),
      mode: "local-fallback" as const,
    };
  }
}
