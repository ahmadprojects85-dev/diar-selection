"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Star, Eye, ArrowUp, ArrowDown, Search, Filter } from "lucide-react";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice: number | null;
  image: string;
  isBestSeller: boolean;
  isFeatured: boolean;
  inStock: boolean;
  sortOrder: number;
  createdAt?: string;
  category: { name: string };
  brand: { name: string };
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  
  // Filter & Sorting state
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState<"sortOrder" | "priceAsc" | "priceDesc" | "nameAsc" | "newest">("sortOrder");

  const fetchProducts = () => {
    setLoading(true);
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;
    setDeleting(id);
    try {
      await fetch(`/api/products/${id}`, { method: "DELETE" });
      fetchProducts();
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(null);
    }
  };

  const toggleBestSeller = async (id: string, current: boolean) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isBestSeller: !current } : p))
    );
    await fetch(`/api/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isBestSeller: !current }),
    });
    fetchProducts();
  };

  const handleMoveOrder = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= processedProducts.length) return;

    const currentItem = processedProducts[index];
    const targetItem = processedProducts[targetIndex];

    const currentOrder = currentItem.sortOrder ?? index;
    const targetOrder = targetItem.sortOrder ?? targetIndex;

    // Optimistically swap in UI
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === currentItem.id) return { ...p, sortOrder: targetOrder };
        if (p.id === targetItem.id) return { ...p, sortOrder: currentOrder };
        return p;
      })
    );

    // Save both to database
    await Promise.all([
      fetch(`/api/products/${currentItem.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sortOrder: targetOrder }),
      }),
      fetch(`/api/products/${targetItem.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sortOrder: currentOrder }),
      }),
    ]);

    fetchProducts();
  };

  const handleMakeTop = async (id: string) => {
    const targetIndex = processedProducts.findIndex((p) => p.id === id);
    if (targetIndex === -1) return;

    const targetProduct = processedProducts[targetIndex];
    const remaining = processedProducts.filter((p) => p.id !== id);
    const newList = [targetProduct, ...remaining];

    // Optimistically re-index 0..N
    setProducts((prev) =>
      prev.map((p) => {
        const newIdx = newList.findIndex((item) => item.id === p.id);
        return { ...p, sortOrder: newIdx >= 0 ? newIdx : p.sortOrder };
      })
    );

    // Save updated order to database
    await Promise.all(
      newList.map((p, idx) =>
        fetch(`/api/products/${p.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sortOrder: idx }),
        })
      )
    );

    fetchProducts();
  };

  // Get unique categories for filter
  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.category?.name) set.add(p.category.name);
    });
    return Array.from(set);
  }, [products]);

  // Filtered & Sorted Products
  const processedProducts = useMemo(() => {
    let result = [...products];

    // Filter by category
    if (selectedCategory !== "All") {
      result = result.filter((p) => p.category?.name === selectedCategory);
    }

    // Filter by search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.slug.toLowerCase().includes(q) ||
          (p.brand?.name && p.brand.name.toLowerCase().includes(q))
      );
    }

    // Sort products
    result.sort((a, b) => {
      if (sortBy === "sortOrder") {
        const diff = (a.sortOrder ?? 0) - (b.sortOrder ?? 0);
        if (diff !== 0) return diff;
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      }
      if (sortBy === "priceAsc") return a.price - b.price;
      if (sortBy === "priceDesc") return b.price - a.price;
      if (sortBy === "nameAsc") return a.name.localeCompare(b.name);
      return 0;
    });

    return result;
  }, [products, selectedCategory, search, sortBy]);

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-serif tracking-wide">Products</h1>
          <p className="text-white/40 text-sm mt-1">
            {products.length} total products in database
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#d49f37] hover:bg-[#B8965E] text-white text-sm font-semibold rounded-lg transition-colors shrink-0"
        >
          <Plus size={18} />
          Add Product
        </Link>
      </div>

      {/* Filter & Sorting Control Bar */}
      <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 mb-6 flex flex-col md:flex-row items-stretch md:items-center gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            placeholder="Search products by name or brand..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-[#d49f37]"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-white/40 shrink-0" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#d49f37]"
          >
            <option value="All">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat} className="bg-[#141414] text-white">
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Sort By Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/40 font-semibold uppercase tracking-wider shrink-0">Sort By:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm text-[#d49f37] font-semibold focus:outline-none focus:border-[#d49f37]"
          >
            <option value="sortOrder" className="bg-[#141414] text-white">
              Display Order (0 = 1st, 1 = 2nd...)
            </option>
            <option value="priceAsc" className="bg-[#141414] text-white">
              Price: Low to High
            </option>
            <option value="priceDesc" className="bg-[#141414] text-white">
              Price: High to Low
            </option>
            <option value="nameAsc" className="bg-[#141414] text-white">
              Name: A to Z
            </option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#d49f37] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : processedProducts.length === 0 ? (
        <div className="text-center py-20 bg-white/[0.02] rounded-xl border border-white/5">
          <p className="text-white/30 text-lg mb-4">No products found</p>
          <button
            onClick={() => {
              setSearch("");
              setSelectedCategory("All");
            }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="bg-white/[0.02] border border-white/5 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left px-4 py-4 text-[11px] uppercase tracking-widest text-[#d49f37] font-bold w-32">
                    Order (0 = 1st)
                  </th>
                  <th className="text-left px-6 py-4 text-[11px] uppercase tracking-widest text-white/30 font-medium">
                    Product
                  </th>
                  <th className="text-left px-6 py-4 text-[11px] uppercase tracking-widest text-white/30 font-medium hidden sm:table-cell">
                    Category
                  </th>
                  <th className="text-left px-6 py-4 text-[11px] uppercase tracking-widest text-white/30 font-medium hidden md:table-cell">
                    Brand
                  </th>
                  <th className="text-left px-6 py-4 text-[11px] uppercase tracking-widest text-white/30 font-medium">
                    Price
                  </th>
                  <th className="text-left px-6 py-4 text-[11px] uppercase tracking-widest text-white/30 font-medium hidden lg:table-cell">
                    Status
                  </th>
                  <th className="text-right px-6 py-4 text-[11px] uppercase tracking-widest text-white/30 font-medium">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {processedProducts.map((product, index) => (
                  <tr
                    key={product.id}
                    className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
                  >
                    {/* Sort Order Input & Arrow Controls */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-[#d49f37] bg-[#d49f37]/10 border border-[#d49f37]/30 px-2 py-1 rounded-md min-w-[36px] text-center">
                          #{index}
                        </span>
                        <div className="flex flex-col gap-0.5">
                          <button
                            onClick={() => handleMoveOrder(index, "up")}
                            disabled={index === 0}
                            className="p-1 hover:bg-white/10 rounded text-white/60 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Move Up"
                          >
                            <ArrowUp size={12} />
                          </button>
                          <button
                            onClick={() => handleMoveOrder(index, "down")}
                            disabled={index === processedProducts.length - 1}
                            className="p-1 hover:bg-white/10 rounded text-white/60 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Move Down"
                          >
                            <ArrowDown size={12} />
                          </button>
                        </div>
                        <button
                          onClick={() => handleMakeTop(product.id)}
                          disabled={index === 0}
                          className="text-[10px] font-bold uppercase tracking-wider text-[#d49f37] bg-[#d49f37]/10 hover:bg-[#d49f37]/20 disabled:opacity-30 disabled:cursor-not-allowed px-2 py-1 rounded-md transition-colors whitespace-nowrap border border-[#d49f37]/30 ml-1"
                          title="Make this product #1 at the top of the site"
                        >
                          Make #1
                        </button>
                      </div>
                    </td>

                    {/* Product Name + Image */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-white/5 overflow-hidden flex-shrink-0 border border-white/10">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-white text-sm font-medium">
                            {product.name}
                          </p>
                          <p className="text-white/30 text-xs mt-0.5">
                            /{product.slug}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-6 py-4 hidden sm:table-cell">
                      <span className="text-white/50 text-sm">
                        {product.category?.name || "—"}
                      </span>
                    </td>

                    {/* Brand */}
                    <td className="px-6 py-4 hidden md:table-cell">
                      <span className="text-white/50 text-sm">
                        {product.brand?.name || "—"}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="px-6 py-4">
                      <span className="text-white text-sm font-medium">
                        {product.price.toLocaleString()} IQD
                      </span>
                      {product.originalPrice && (
                        <span className="text-white/30 text-xs line-through ml-2">
                          {product.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            toggleBestSeller(product.id, product.isBestSeller)
                          }
                          className={`p-1.5 rounded-md transition-colors ${
                            product.isBestSeller
                              ? "text-[#d49f37] bg-[#d49f37]/10"
                              : "text-white/20 hover:text-white/40"
                          }`}
                          title="Toggle Best Seller"
                        >
                          <Star
                            size={14}
                            fill={product.isBestSeller ? "#d49f37" : "none"}
                          />
                        </button>
                        <span
                          className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-full ${
                            product.inStock
                              ? "bg-green-500/10 text-green-400"
                              : "bg-red-500/10 text-red-400"
                          }`}
                        >
                          {product.inStock ? "In Stock" : "Out"}
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/products/${product.slug}`}
                          target="_blank"
                          className="p-2 text-white/20 hover:text-white/50 transition-colors"
                          title="View on site"
                        >
                          <Eye size={16} />
                        </Link>
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="p-2 text-white/20 hover:text-[#d49f37] transition-colors"
                          title="Edit"
                        >
                          <Pencil size={16} />
                        </Link>
                        <button
                          onClick={() =>
                            handleDelete(product.id, product.name)
                          }
                          disabled={deleting === product.id}
                          className="p-2 text-white/20 hover:text-red-400 transition-colors disabled:opacity-50"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
