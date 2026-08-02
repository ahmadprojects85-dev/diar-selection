import { Hero } from "@/components/Hero";
import { PremiumCategories } from "@/components/PremiumCategories";
import { BestSellers } from "@/components/BestSellers";
import { BrewingGuide } from "@/components/BrewingGuide";
import { FeaturedNews } from "@/components/FeaturedNews";
import { prisma, withRetry } from "@/lib/prisma";

export const revalidate = 60;

export default async function Home() {
  let news: any[] = [];
  try {
    news = await withRetry(() => prisma.newsArticle.findMany({
      where: { isFeatured: true },
      orderBy: [
        { sortOrder: "asc" },
        { createdAt: "desc" }
      ],
    }));
  } catch (e) {
    console.error("Failed to fetch news for homepage:", e);
  }

  return (
    <>
      <Hero />
      <BestSellers />
      <BrewingGuide />
      <FeaturedNews initialNews={news} />
    </>
  );
}
