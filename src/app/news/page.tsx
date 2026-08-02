import { NewsClient } from "./NewsClient";
import { Metadata } from "next";
import { prisma, withRetry } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Coffee News & Insights | Diar Selection",
  description: "Stay updated with Diar Selection's latest news, coffee brewing chemistry, local stories, and equipment guides.",
};

export const revalidate = 60;

export default async function NewsPage() {
  let news: any[] = [];
  try {
    news = await withRetry(() => prisma.newsArticle.findMany({
      orderBy: [
        { sortOrder: "asc" },
        { createdAt: "desc" }
      ],
    }));
  } catch (e) {
    console.error("Failed to fetch news for page:", e);
  }

  return <NewsClient initialNews={news} />;
}
