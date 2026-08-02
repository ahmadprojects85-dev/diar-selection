import { prisma, withRetry } from "@/lib/prisma";
import { NewsArticleClient } from "./NewsArticleClient";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const article: any = await withRetry(() => prisma.newsArticle.findUnique({
    where: { id: resolvedParams.id },
  }));
  if (!article) return { title: "Article Not Found" };
  return {
    title: `${article.title} | Diar Selection News`,
    description: article.excerpt.substring(0, 160),
  };
}

export default async function NewsArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const article: any = await withRetry(() => prisma.newsArticle.findUnique({
    where: { id: resolvedParams.id },
  }));

  if (!article) {
    notFound();
  }

  return <NewsArticleClient article={article} />;
}
