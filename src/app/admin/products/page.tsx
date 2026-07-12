"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Star, Eye } from "lucide-react";

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
  category: { name: string };
  brand: { name: string };
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

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
    await fetch(`/api/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isBestSeller: !current }),
    });
    fetchProducts();
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-serif tracking-wide">Products</h1>
          <p className="text-white/40 text-sm mt-1">
            {products.length} total products
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 px-5 py-2.5 bg-[#d49f37] hover:bg-[#B8965E] text-white text-sm font-semibold rounded-lg transition-colors"
        >
          <Plus size={18} />
          Add Product
        </Link>
      </div>

      {/* Products Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#d49f37] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 bg-white/[0.02] rounded-xl border border-white/5">
          <p className="text-white/30 text-lg mb-4">No products yet</p>
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#d49f37] text-white text-sm font-semibold rounded-lg"
          >
            <Plus size={18} />
            Add Your First Product
          </Link>
        </div>
      ) : (
        <div className="bg-white/[0.02] border border-white/5 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
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
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
                  >
                    {/* Product Name + Image */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-white/5 overflow-hidden flex-shrink-0">
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
