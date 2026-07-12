"use client";

import { useEffect, useState } from "react";
import { Package, Grid3X3, Tag, TrendingUp, Coffee } from "lucide-react";
import Link from "next/link";

interface Stats {
  products: number;
  categories: number;
  bestSellers: number;
  brands: number;
  brewingMethods: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    products: 0,
    categories: 0,
    bestSellers: 0,
    brands: 0,
    brewingMethods: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/products").then((r) => r.json()),
      fetch("/api/categories").then((r) => r.json()),
      fetch("/api/brewing-methods").then((r) => r.json()),
      fetch("/api/brands").then((r) => r.json()),
    ])
      .then(([products, categories, brewingMethods, brands]) => {
        setStats({
          products: Array.isArray(products) ? products.length : 0,
          categories: Array.isArray(categories) ? categories.length : 0,
          bestSellers: Array.isArray(products)
            ? products.filter((p: any) => p.isBestSeller).length
            : 0,
          brewingMethods: Array.isArray(brewingMethods) ? brewingMethods.length : 0,
          brands: Array.isArray(brands) ? brands.length : 0,
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    {
      label: "Products",
      value: stats.products,
      icon: Package,
      href: "/admin/products",
      colorClass: "text-gold bg-gold/10",
    },
    {
      label: "Categories",
      value: stats.categories,
      icon: Grid3X3,
      href: "/admin/categories",
      colorClass: "text-green-500 bg-green-500/10",
    },
    {
      label: "Brands",
      value: stats.brands,
      icon: Tag,
      href: "/admin/brands",
      colorClass: "text-purple-500 bg-purple-500/10",
    },
    {
      label: "Brewing Methods",
      value: stats.brewingMethods,
      icon: Coffee,
      href: "/admin/brewing-methods",
      colorClass: "text-orange-500 bg-orange-500/10",
    },
    {
      label: "Best Sellers",
      value: stats.bestSellers,
      icon: TrendingUp,
      href: "/admin/products?filter=bestsellers",
      colorClass: "text-blue-500 bg-blue-500/10",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-serif tracking-wide mb-8">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-10">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="bg-white/[0.03] border border-white/5 rounded-xl p-6 hover:border-white/10 transition-colors group"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.colorClass}`}
                >
                  <Icon size={20} />
                </div>
              </div>
              <p className="text-3xl font-bold text-white mb-1">
                {loading ? "—" : stat.value}
              </p>
              <p className="text-white/40 text-sm">{stat.label}</p>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <h2 className="text-lg font-serif tracking-wide mb-4 text-white/70">
        Quick Actions
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/admin/products/new"
          className="bg-gold/10 border border-gold/20 rounded-xl p-5 hover:border-gold/40 transition-colors text-center"
        >
          <Package size={24} className="mx-auto mb-3 text-gold" />
          <p className="text-sm font-semibold text-gold">Add Product</p>
        </Link>
        <Link
          href="/admin/categories"
          className="bg-white/[0.03] border border-white/5 rounded-xl p-5 hover:border-white/10 transition-colors text-center"
        >
          <Grid3X3 size={24} className="mx-auto mb-3 text-white/40" />
          <p className="text-sm text-white/60">Manage Categories</p>
        </Link>
      </div>
    </div>
  );
}
