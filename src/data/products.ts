export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice?: number;
  sku: string;
  images: string[];
  description: string;
  specifications: Record<string, string>;
  features: string[];
  rating: number;
  reviewCount: number;
  isBestSeller: boolean;
  isFeatured: boolean;
  isHidden: boolean;
  displayOrder: number;
  officialProduct: boolean;
  inStock: boolean;
}

export const products: Product[] = [
  {
    id: "1",
    slug: "timemore-c3-max-hand-grinder",
    name: "Timemore C3 Max Hand Grinder",
    brand: "Timemore",
    category: "Grinders",
    price: 79.00,
    sku: "TM-C3MAX-BK",
    images: [
      "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&q=80",
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefda?w=800&q=80",
      "https://images.unsplash.com/photo-1611564494260-6f21b80af7ea?w=800&q=80",
    ],
    description: "The Timemore C3 Max is the ultimate hand grinder for specialty coffee enthusiasts. Featuring an upgraded stainless steel conical burr set, it delivers exceptional grind consistency across all brew methods. The ergonomic design and increased capacity make it perfect for both home and travel use.",
    specifications: {
      "Burr Type": "Stainless Steel Conical",
      "Capacity": "30g",
      "Body Material": "Aluminum Alloy",
      "Adjustment": "Stepless",
      "Weight": "480g",
      "Dimensions": "17.5 × 5.3 cm",
    },
    features: [
      "Upgraded S2C stainless steel burr set",
      "Stepless grind adjustment",
      "Anti-slip silicone grip",
      "Increased 30g bean capacity",
      "Dual bearing stabilization",
      "Foldable handle for portability",
    ],
    rating: 4.8,
    reviewCount: 142,
    isBestSeller: true,
    isFeatured: false,
    isHidden: false,
    displayOrder: 1,
    officialProduct: true,
    inStock: true,
  },
  {
    id: "2",
    slug: "fellow-stagg-ekg-electric-kettle",
    name: "Fellow Stagg EKG Electric Kettle",
    brand: "Fellow",
    category: "Kettles",
    price: 199.00,
    sku: "FW-EKG-MB",
    images: [
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80",
      "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800&q=80",
      "https://images.unsplash.com/photo-1517256064527-8f30f8e62c0c?w=800&q=80",
    ],
    description: "The Fellow Stagg EKG is a precision pour-over kettle that combines stunning design with world-class functionality. Variable temperature control, a built-in brew stopwatch, and the iconic Stagg spout for unparalleled pour control make this the gold standard in electric kettles.",
    specifications: {
      "Capacity": "0.9L",
      "Material": "Stainless Steel 301",
      "Temperature Range": "57°C - 100°C",
      "Display": "LCD with Fahrenheit/Celsius",
      "Wattage": "1200W",
      "Cord Length": "76 cm",
    },
    features: [
      "Variable temperature control (57-100°C)",
      "Built-in brew stopwatch",
      "Precision pour spout",
      "60-minute hold mode",
      "LCD temperature display",
      "Award-winning design",
    ],
    rating: 4.9,
    reviewCount: 98,
    isBestSeller: true,
    isFeatured: true,
    isHidden: false,
    displayOrder: 2,
    officialProduct: true,
    inStock: true,
  },
  {
    id: "3",
    slug: "cafec-abaca-plus-coffee-filters",
    name: "CAFEC Abaca+ Coffee Filters",
    brand: "CAFEC",
    category: "Filters & Papers",
    price: 9.00,
    sku: "CF-ABACA-100",
    images: [
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80",
      "https://images.unsplash.com/photo-1498804103079-a6351b050096?w=800&q=80",
    ],
    description: "CAFEC Abaca+ filters are crafted from premium abaca (Manila hemp) fibers, known for their exceptional filtration and clean cup profile. These Japanese-made filters remove unwanted oils while preserving the delicate flavor notes of your specialty coffee.",
    specifications: {
      "Material": "Abaca (Manila Hemp)",
      "Size": "Cup 4 (2-4 cups)",
      "Count": "100 sheets",
      "Origin": "Made in Japan",
      "Color": "Natural White",
    },
    features: [
      "Superior filtration with abaca fibers",
      "Clean, crisp cup profile",
      "No paper taste",
      "Consistent flow rate",
      "Made in Japan quality",
    ],
    rating: 4.7,
    reviewCount: 67,
    isBestSeller: true,
    isFeatured: false,
    isHidden: false,
    displayOrder: 3,
    officialProduct: true,
    inStock: true,
  },
  {
    id: "4",
    slug: "hario-v60-drip-decanter",
    name: "Hario V60 Drip Decanter",
    brand: "Hario",
    category: "Brewing Equipment",
    price: 25.00,
    sku: "HR-V60DC-02",
    images: [
      "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=800&q=80",
      "https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=800&q=80",
    ],
    description: "The Hario V60 Drip Decanter is an elegant all-in-one pour-over brewing system. The heat-resistant borosilicate glass server with an integrated V60 dripper creates a seamless brewing experience. The leather wrap adds a touch of sophistication.",
    specifications: {
      "Material": "Borosilicate Glass",
      "Capacity": "700ml",
      "Dripper Size": "02",
      "Filter": "V60 Paper Filters",
      "Origin": "Made in Japan",
    },
    features: [
      "All-in-one brewing system",
      "Heat-resistant borosilicate glass",
      "Elegant leather wrap",
      "Integrated V60 dripper",
      "Dishwasher safe (glass only)",
    ],
    rating: 4.6,
    reviewCount: 89,
    isBestSeller: true,
    isFeatured: false,
    isHidden: false,
    displayOrder: 4,
    officialProduct: true,
    inStock: true,
  },
  {
    id: "5",
    slug: "glass-coffee-server-600ml",
    name: "Glass Coffee Server 600ml",
    brand: "Hario",
    category: "Servers",
    price: 25.00,
    sku: "HR-GS600",
    images: [
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80",
      "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800&q=80",
    ],
    description: "A beautifully crafted glass coffee server with precise measurement markings and a heat-resistant borosilicate body. Perfect for serving pour-over coffee with elegance and precision.",
    specifications: {
      "Material": "Borosilicate Glass",
      "Capacity": "600ml",
      "Handle": "Glass",
      "Origin": "Made in Japan",
    },
    features: [
      "Heat-resistant borosilicate glass",
      "Clear measurement markings",
      "Elegant pour spout",
      "Microwave safe",
    ],
    rating: 4.5,
    reviewCount: 54,
    isBestSeller: true,
    isFeatured: false,
    isHidden: false,
    displayOrder: 5,
    officialProduct: true,
    inStock: true,
  },
  {
    id: "6",
    slug: "normcore-coffee-tamper",
    name: "Normcore Coffee Tamper",
    brand: "Normcore",
    category: "Espresso Accessories",
    price: 45.00,
    sku: "NC-TAMP-58",
    images: [
      "https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=800&q=80",
      "https://images.unsplash.com/photo-1504630083234-14187a9df0f5?w=800&q=80",
    ],
    description: "The Normcore Spring-loaded Coffee Tamper delivers perfectly level tamps every single time. The calibrated spring mechanism ensures consistent 25-30 lb pressure, eliminating guesswork and channeling from your espresso preparation.",
    specifications: {
      "Diameter": "58.5mm",
      "Material": "Stainless Steel + Aluminum",
      "Spring Pressure": "25-30 lbs",
      "Weight": "340g",
      "Compatibility": "58mm portafilters",
    },
    features: [
      "Spring-loaded calibrated pressure",
      "Self-leveling design",
      "Premium stainless steel base",
      "Ergonomic aluminum handle",
      "Consistent tamping every time",
    ],
    rating: 4.8,
    reviewCount: 76,
    isBestSeller: true,
    isFeatured: true,
    isHidden: false,
    displayOrder: 6,
    officialProduct: true,
    inStock: true,
  },
  {
    id: "7",
    slug: "timemore-black-mirror-digital-scale",
    name: "Timemore Black Mirror Digital Scale",
    brand: "Timemore",
    category: "Scales",
    price: 65.00,
    sku: "TM-BMSC-BK",
    images: [
      "https://images.unsplash.com/photo-1611854779393-1b2da9d400fe?w=800&q=80",
      "https://images.unsplash.com/photo-1517256064527-8f30f8e62c0c?w=800&q=80",
    ],
    description: "The Timemore Black Mirror is a precision coffee scale featuring a sleek glass surface, auto-timer function, and 0.1g accuracy. Its minimalist design and responsive touch make it the perfect companion for precision brewing.",
    specifications: {
      "Accuracy": "0.1g",
      "Max Capacity": "2000g",
      "Display": "LED",
      "Power": "USB-C Rechargeable",
      "Dimensions": "15 × 13 × 2.6 cm",
    },
    features: [
      "0.1g precision accuracy",
      "Auto-start timer",
      "USB-C rechargeable battery",
      "Sleek tempered glass surface",
      "Flow rate display",
      "Auto-off power saving",
    ],
    rating: 4.7,
    reviewCount: 113,
    isBestSeller: true,
    isFeatured: false,
    isHidden: false,
    displayOrder: 7,
    officialProduct: true,
    inStock: true,
  },
  {
    id: "8",
    slug: "aeropress-go-travel-brewer",
    name: "AeroPress Go Travel Brewer",
    brand: "AeroPress",
    category: "Brewing Equipment",
    price: 39.00,
    sku: "AP-GO-01",
    images: [
      "https://images.unsplash.com/photo-1545665277-5937489579f2?w=800&q=80",
      "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800&q=80",
    ],
    description: "The AeroPress Go is the ultimate travel coffee maker. Compact, lightweight, and endlessly versatile, it brews smooth, rich coffee in under a minute. The included travel mug doubles as a carrying case.",
    specifications: {
      "Capacity": "237ml (8 oz)",
      "Material": "BPA-free Polypropylene",
      "Weight": "326g",
      "Brew Time": "1-2 minutes",
      "Filter": "Micro paper filters",
    },
    features: [
      "Ultra-portable design with travel mug",
      "Smooth, grit-free coffee",
      "Total immersion brewing",
      "Self-cleaning press action",
      "350 micro-filters included",
    ],
    rating: 4.9,
    reviewCount: 201,
    isBestSeller: true,
    isFeatured: true,
    isHidden: false,
    displayOrder: 8,
    officialProduct: true,
    inStock: true,
  },
  {
    id: "9",
    slug: "hario-v60-ceramic-dripper",
    name: "Hario V60 Ceramic Dripper",
    brand: "Hario",
    category: "Brewing Equipment",
    price: 22.00,
    sku: "HR-V60C-02",
    images: [
      "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=800&q=80",
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80",
    ],
    description: "The iconic Hario V60 Ceramic Dripper in stunning white. The Arita porcelain body retains heat beautifully while the signature spiral ribs create the optimal airflow for a clean, flavorful extraction.",
    specifications: {
      "Material": "Arita Porcelain",
      "Size": "02 (1-4 cups)",
      "Color": "White",
      "Origin": "Made in Japan",
      "Filter": "V60 Size 02",
    },
    features: [
      "Arita porcelain heat retention",
      "Signature spiral rib design",
      "Large single hole for flow control",
      "Elegant minimalist design",
      "Made in Japan craftsmanship",
    ],
    rating: 4.6,
    reviewCount: 156,
    isBestSeller: true,
    isFeatured: false,
    isHidden: false,
    displayOrder: 9,
    officialProduct: true,
    inStock: true,
  },
  {
    id: "10",
    slug: "1zpresso-q2-s-hand-grinder",
    name: "1Zpresso Q2 S Hand Grinder",
    brand: "1Zpresso",
    category: "Grinders",
    price: 129.00,
    sku: "1Z-Q2S-BK",
    images: [
      "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&q=80",
      "https://images.unsplash.com/photo-1611854779393-1b2da9d400fe?w=800&q=80",
    ],
    description: "The 1Zpresso Q2 S is a compact, travel-friendly hand grinder that delivers exceptional grind quality. Its 38mm seven-core stainless steel burr set produces uniform particle size across all brew methods.",
    specifications: {
      "Burr Type": "38mm Stainless Steel",
      "Capacity": "20g",
      "Adjustment": "Stepped (click per step)",
      "Weight": "420g",
      "Dimensions": "15 × 4.7 cm",
    },
    features: [
      "Seven-core stainless steel burr",
      "Ultra-compact travel size",
      "Stepped adjustment for repeatability",
      "Aluminum unibody construction",
      "Quick grind speed",
    ],
    rating: 4.7,
    reviewCount: 89,
    isBestSeller: true,
    isFeatured: false,
    isHidden: false,
    displayOrder: 10,
    officialProduct: true,
    inStock: true,
  },
  {
    id: "11",
    slug: "milk-frothing-pitcher-350ml",
    name: "Milk Frothing Pitcher 350ml",
    brand: "Normcore",
    category: "Espresso Accessories",
    price: 18.00,
    sku: "NC-FP350",
    images: [
      "https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=800&q=80",
      "https://images.unsplash.com/photo-1504630083234-14187a9df0f5?w=800&q=80",
    ],
    description: "A precision-crafted stainless steel milk frothing pitcher designed for latte art. The tapered spout allows for fine control when pouring, and the measurement markings ensure consistent milk volumes.",
    specifications: {
      "Capacity": "350ml",
      "Material": "18/8 Stainless Steel",
      "Spout": "Sharp tapered",
      "Finish": "Matte Black",
    },
    features: [
      "Sharp tapered spout for latte art",
      "Interior measurement markings",
      "18/8 stainless steel durability",
      "Comfortable handle grip",
    ],
    rating: 4.5,
    reviewCount: 43,
    isBestSeller: true,
    isFeatured: false,
    isHidden: false,
    displayOrder: 11,
    officialProduct: true,
    inStock: true,
  },
  {
    id: "12",
    slug: "fellow-atmos-vacuum-canister",
    name: "Fellow Atmos Vacuum Canister",
    brand: "Fellow",
    category: "Storage & Fitness",
    price: 89.00,
    sku: "FW-ATM-MB",
    images: [
      "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&q=80",
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefda?w=800&q=80",
    ],
    description: "The Fellow Atmos Vacuum Canister actively removes air to keep your coffee beans fresher for longer. The integrated vacuum pump and one-way valve create an airtight seal that preserves peak flavor and aroma.",
    specifications: {
      "Capacity": "1.2L (approx. 340g coffee)",
      "Material": "Stainless Steel",
      "Seal Type": "Vacuum with one-way valve",
      "Dimensions": "11.4 × 17 cm",
    },
    features: [
      "Integrated vacuum pump",
      "One-way CO2 valve",
      "Airtight silicone seal",
      "BPA-free construction",
      "Visual vacuum indicator",
    ],
    rating: 4.8,
    reviewCount: 67,
    isBestSeller: true,
    isFeatured: true,
    isHidden: false,
    displayOrder: 12,
    officialProduct: true,
    inStock: true,
  },
  {
    id: "13",
    slug: "fellow-pour-over-kettle",
    name: "Fellow Pour Over Kettle",
    brand: "Fellow",
    category: "Kettles",
    price: 125.00,
    sku: "FW-STAGG-SS",
    images: [
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80",
      "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800&q=80",
    ],
    description: "The Fellow Stagg Stovetop Pour-Over Kettle features the precision Stagg spout for ultimate pour control. The built-in thermometer and weighted handle create a balanced, intuitive pouring experience.",
    specifications: {
      "Capacity": "1.0L",
      "Material": "Stainless Steel",
      "Thermometer": "Built-in analog",
      "Compatibility": "All stovetops including induction",
    },
    features: [
      "Precision Stagg pour spout",
      "Built-in analog thermometer",
      "Counterbalanced handle",
      "All stovetop compatible",
      "Fluted interior for noise reduction",
    ],
    rating: 4.7,
    reviewCount: 54,
    isBestSeller: false,
    isFeatured: true,
    isHidden: false,
    displayOrder: 13,
    officialProduct: true,
    inStock: true,
  },
  {
    id: "14",
    slug: "wdt-tool-espresso",
    name: "WDT Tool for Espresso",
    brand: "Normcore",
    category: "Espresso Accessories",
    price: 25.00,
    sku: "NC-WDT-BK",
    images: [
      "https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=800&q=80",
      "https://images.unsplash.com/photo-1504630083234-14187a9df0f5?w=800&q=80",
    ],
    description: "A precision-engineered Weiss Distribution Technique tool for eliminating clumps in espresso grounds. Eight 0.4mm stainless steel needles ensure thorough distribution for channeling-free extractions.",
    specifications: {
      "Needles": "8 × 0.4mm stainless steel",
      "Handle Material": "Anodized Aluminum",
      "Compatibility": "49-58mm portafilters",
      "Storage": "Magnetic base stand",
    },
    features: [
      "Eight precision 0.4mm needles",
      "Eliminates clumps and channels",
      "Magnetic storage base",
      "Adjustable needle depth",
      "Premium anodized finish",
    ],
    rating: 4.6,
    reviewCount: 88,
    isBestSeller: false,
    isFeatured: true,
    isHidden: false,
    displayOrder: 14,
    officialProduct: true,
    inStock: true,
  },
  {
    id: "15",
    slug: "coffee-dosing-cup-58mm",
    name: "Coffee Dosing Cup 58mm",
    brand: "Normcore",
    category: "Espresso Accessories",
    price: 12.00,
    sku: "NC-DC58-SS",
    images: [
      "https://images.unsplash.com/photo-1504630083234-14187a9df0f5?w=800&q=80",
      "https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=800&q=80",
    ],
    description: "A precision stainless steel dosing cup that fits perfectly on 58mm grinders. Transfer grounds cleanly from grinder to portafilter without mess or waste.",
    specifications: {
      "Diameter": "58mm",
      "Material": "Stainless Steel",
      "Capacity": "25g+",
      "Height": "47mm",
    },
    features: [
      "Snug fit on 58mm grinders",
      "Clean, mess-free transfer",
      "Durable stainless steel",
      "Polished interior for easy cleaning",
    ],
    rating: 4.4,
    reviewCount: 36,
    isBestSeller: false,
    isFeatured: false,
    isHidden: false,
    displayOrder: 15,
    officialProduct: true,
    inStock: true,
  },
  {
    id: "16",
    slug: "knock-box-espresso",
    name: "Knock Box for Espresso",
    brand: "Normcore",
    category: "Espresso Accessories",
    price: 29.00,
    sku: "NC-KB-BK",
    images: [
      "https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=800&q=80",
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefda?w=800&q=80",
    ],
    description: "A sturdy, slip-resistant knock box for disposing of used espresso pucks. The shock-absorbing bar and rubberized base keep your workflow clean and efficient.",
    specifications: {
      "Material": "ABS Plastic + Rubber",
      "Bar": "Stainless Steel with Rubber Cover",
      "Base": "Non-slip rubber",
      "Dimensions": "15 × 11 × 10 cm",
    },
    features: [
      "Shock-absorbing knock bar",
      "Non-slip rubber base",
      "Removable bar for cleaning",
      "Compact countertop footprint",
    ],
    rating: 4.5,
    reviewCount: 52,
    isBestSeller: false,
    isFeatured: false,
    isHidden: false,
    displayOrder: 16,
    officialProduct: true,
    inStock: true,
  },
];

export const brands = [...new Set(products.map((p) => p.brand))];
export const categories = [...new Set(products.map((p) => p.category))];

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getBestSellers(): Product[] {
  return products
    .filter((p) => p.isBestSeller && !p.isHidden)
    .sort((a, b) => a.displayOrder - b.displayOrder);
}

export function getFeatured(): Product[] {
  return products
    .filter((p) => p.isFeatured && !p.isHidden)
    .sort((a, b) => a.displayOrder - b.displayOrder);
}

export function getVisibleProducts(): Product[] {
  return products
    .filter((p) => !p.isHidden)
    .sort((a, b) => a.displayOrder - b.displayOrder);
}

export function searchProducts(query: string): Product[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return products.filter(
    (p) =>
      !p.isHidden &&
      (p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q))
  );
}

export function getProductsByBrand(brand: string): Product[] {
  return products
    .filter((p) => p.brand === brand && !p.isHidden)
    .sort((a, b) => a.displayOrder - b.displayOrder);
}

export function getProductsByCategory(category: string): Product[] {
  return products
    .filter((p) => p.category === category && !p.isHidden)
    .sort((a, b) => a.displayOrder - b.displayOrder);
}
