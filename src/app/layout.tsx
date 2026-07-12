import type { Metadata } from "next";
import { Noto_Sans, Noto_Sans_Osage, Playfair_Display, Noto_Kufi_Arabic, Great_Vibes } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { LanguageProvider } from "@/context/LanguageContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { CartProvider } from "@/context/CartContext";

import { FloatingThemeToggle } from "@/components/FloatingThemeToggle";

const notoSans = Noto_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const notoOsage = Noto_Sans_Osage({
  weight: ["400"],
  variable: "--font-osage",
  display: "swap",
  subsets: ["osage"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const scriptFont = Great_Vibes({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-script",
  display: "swap",
});

const notoArabic = Noto_Kufi_Arabic({
  subsets: ["arabic"],
  variable: "--font-arabic",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Diar Selection — Premium Coffee Tools & Equipment",
  description:
    "Diar Selection is your premium destination for authentic specialty coffee equipment. Explore hand-picked grinders, kettles, brewing tools, and accessories from the world's finest brands.",
  keywords: [
    "specialty coffee",
    "coffee equipment",
    "coffee grinder",
    "pour over",
    "coffee tools",
    "Timemore",
    "Fellow",
    "Hario",
    "AeroPress",
    "premium coffee",
    "diar selection",
  ],
  openGraph: {
    title: "Diar Selection — Premium Coffee Tools & Equipment",
    description:
      "Your premium destination for authentic specialty coffee equipment. Hand-picked grinders, kettles, and brewing tools from the world's finest brands.",
    url: "https://diarselection.com",
    siteName: "Diar Selection",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Diar Selection — Premium Coffee Tools & Equipment",
    description:
      "Your premium destination for authentic specialty coffee equipment.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${notoSans.variable} ${notoOsage.variable} ${playfair.variable} ${notoArabic.variable} ${scriptFont.variable}`}>
      <body className="bg-bg-primary text-text-primary font-sans antialiased overflow-x-hidden">
        <ThemeProvider>
          <LanguageProvider>
            <CartProvider>
              <WishlistProvider>
                <Navbar />
                <main>{children}</main>
                <Footer />
                <FloatingThemeToggle />
              </WishlistProvider>
            </CartProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
