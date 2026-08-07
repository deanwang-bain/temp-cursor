import { NextResponse } from "next/server";
import { getKnowledge } from "@/lib/data";

export async function POST(req: Request) {
  const { query, locale } = (await req.json()) as { query: string; locale: "en" | "zh" };
  const q = (query || "").toLowerCase();
  const articles = getKnowledge();

  const match = articles.find((a) => {
    const hay = `${a.title} ${a.content} ${a.titleZh} ${a.contentZh} ${a.tags.join(" ")}`.toLowerCase();
    return a.tags.some((tag) => q.includes(tag)) || hay.split(" ").some((w) => w.length > 3 && q.includes(w));
  });

  if (match) {
    return NextResponse.json({
      answer: locale === "zh" ? match.contentZh : match.content,
      source: match.id,
    });
  }

  if (q.includes("oee") || q.includes("可用率")) {
    const a = articles.find((x) => x.id === "kb-002")!;
    return NextResponse.json({ answer: locale === "zh" ? a.contentZh : a.content, source: a.id });
  }
  if (q.includes("changeover") || q.includes("换型") || q.includes("混线")) {
    const a = articles.find((x) => x.id === "kb-001")!;
    return NextResponse.json({ answer: locale === "zh" ? a.contentZh : a.content, source: a.id });
  }
  if (q.includes("supplier") || q.includes("供应商") || q.includes("otif")) {
    const a = articles.find((x) => x.id === "kb-004")!;
    return NextResponse.json({ answer: locale === "zh" ? a.contentZh : a.content, source: a.id });
  }
  if (q.includes("quality") || q.includes("hv") || q.includes("绝缘") || q.includes("质量")) {
    const a = articles.find((x) => x.id === "kb-003")!;
    return NextResponse.json({ answer: locale === "zh" ? a.contentZh : a.content, source: a.id });
  }

  return NextResponse.json({
    answer:
      locale === "zh"
        ? "我是培训助手（演示）。请询问换型、OEE、供应商、质量或需求计划相关问题。"
        : "I am the training assistant (demo). Ask about changeover, OEE, suppliers, quality, or demand planning.",
  });
}
