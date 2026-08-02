import { NextResponse } from "next/server";
import { prisma, withRetry } from "@/lib/prisma";

export async function GET() {
  try {
    let slides: any[] = (await withRetry(() =>
      prisma.heroSlide.findMany({
        orderBy: [
          { sortOrder: "asc" },
          { createdAt: "desc" },
        ],
      })
    )) as any[];

    // If database is empty, seed default initial slides so admin can manage/delete/edit them
    if (slides.length === 0) {
      const defaults = [
        {
          image: "/hero-luxury-v3.webp",
          mobileImage: "/mobile-hero-1.png",
          textEn: "Curating specialty coffee tools and brewing methods based on expertise, science, and global standards.",
          textAr: "اختيار معدات وطرق تحضير القهوة بناءً على الخبرة والعلم والمعايير العالمية.",
          textKu: "هەڵبژاردنی کەرەستەی دروستکردنی قاوە و شێوازەکانی ئامادەکردنی قاوە لەسەر بنەمای ئەزموون، زانست، ستانداردە جیهانییەکان.",
          buttonLink: "/products",
          sortOrder: 0,
          isActive: true,
        },
        {
          image: "/hero-coffee-dark-new.png",
          mobileImage: "/mobile-hero-2.png",
          textEn: "Precision grinders engineered for flawless extraction and maximum flavor clarity.",
          textAr: "أدوات طحن القهوة المتقدمة للحصول على النكهة المثالية والاستخلاص الدقيق.",
          textKu: "ئامرازی پێشکەوتووی هاڕینی قاوە بۆ بەدەستهێنانی تامی تەواو و دروستکردنی هاوسەنگ.",
          buttonLink: "/products",
          sortOrder: 1,
          isActive: true,
        },
        {
          image: "/luxury_pour_over_setup_1783452104125.png",
          mobileImage: "/mobile-hero-3.png",
          textEn: "Authentic gear hand-picked from the world's finest specialty coffee brands.",
          textAr: "معدات أصيلة من أفضل العلامات التجارية العالمية للارتقاء بقهوتك اليومية.",
          textKu: "ئامرازە ڕەسەنەکانی باشترین براندەکانی جیهان بۆ بەرزکردنەوەی کوالیتی قاوەکەت.",
          buttonLink: "/products",
          sortOrder: 2,
          isActive: true,
        },
      ];

      for (const item of defaults) {
        await withRetry(() => prisma.heroSlide.create({ data: item }));
      }

      slides = await withRetry(() =>
        prisma.heroSlide.findMany({
          orderBy: [{ sortOrder: "asc" }],
        })
      );
    }

    // Remove duplicates if any exist in the database
    const seenImages = new Set<string>();
    const cleanList: typeof slides = [];
    for (const s of slides) {
      if (seenImages.has(s.image)) {
        await withRetry(() => prisma.heroSlide.delete({ where: { id: s.id } }));
      } else {
        seenImages.add(s.image);
        cleanList.push(s);
      }
    }
    slides = cleanList;

    return NextResponse.json(slides);
  } catch (error) {
    console.error("Failed to fetch hero slides:", error);
    return NextResponse.json({ error: "Failed to fetch hero slides" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { image, mobileImage, textEn, textAr, textKu, textKm, buttonLink, sortOrder, isActive } = body;

    if (!image) {
      return NextResponse.json({ error: "Image is required" }, { status: 400 });
    }

    const slide = await withRetry(() =>
      prisma.heroSlide.create({
        data: {
          image,
          mobileImage: mobileImage || null,
          textEn: textEn || null,
          textAr: textAr || null,
          textKu: textKu || null,
          textKm: textKm || null,
          buttonLink: buttonLink || "/products",
          sortOrder: sortOrder ? parseInt(sortOrder) : 0,
          isActive: isActive !== undefined ? Boolean(isActive) : true,
        },
      })
    );

    return NextResponse.json(slide);
  } catch (error) {
    console.error("Failed to create hero slide:", error);
    return NextResponse.json({ error: "Failed to create hero slide" }, { status: 500 });
  }
}
