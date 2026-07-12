import { Hero } from "@/components/Hero";
import { PremiumCategories } from "@/components/PremiumCategories";
import { BestSellers } from "@/components/BestSellers";
import { BrewingGuide } from "@/components/BrewingGuide";
import { AboutSection } from "@/components/AboutSection";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <>
      <Hero />
      <BestSellers />
      <BrewingGuide />
      <AboutSection />
    </>
  );
}
