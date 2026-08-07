import { NextResponse } from "next/server";
import { chatRespond, type ChatProviderId } from "@/lib/chat";

export async function POST(req: Request) {
  const body = (await req.json()) as {
    query: string;
    locale: "en" | "zh";
    provider?: ChatProviderId;
  };

  const provider: ChatProviderId =
    body.provider === "openai" ? "openai" : "fake";

  const result = await chatRespond(provider, {
    query: body.query || "",
    locale: body.locale === "zh" ? "zh" : "en",
  });

  return NextResponse.json(result);
}
