"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";

interface Brand {
  id: string;
  name: string;
  slug: string;
  _count?: { products: number };
}

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [name, setName] = useState("");
  const [nameAr, setNameAr] = useState("");
  const [nameKu, setNameKu] = useState("");
  const [slug, setSlug] = useState("");
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const fetchBrands = () => {
    setLoading(true);
    fetch("/api/brands")
      .then((r) => r.json())
      .then((data) => setBrands(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleNameChange = (val: string) => {
    setName(val);
    setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !slug) return;
    setAdding(true);
    setError("");

    try {
      const url = editingId ? `/api/brands/${editingId}` : "/api/brands";
      const method = editingId ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, nameAr, nameKu, slug }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save brand");
      }

      resetForm();
      fetchBrands();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this brand?")) return;
    try {
      const res = await fetch(`/api/brands/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      if (editingId === id) resetForm();
      fetchBrands();
    } catch (err) {
      console.error(err);
      alert("Failed to delete brand");
    }
  };

  const handleEdit = (brand: any) => {
    setEditingId(brand.id);
    setName(brand.name);
    setNameAr(brand.nameAr || "");
    setNameKu(brand.nameKu || "");
    setSlug(brand.slug);
  };

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setNameAr("");
    setNameKu("");
    setSlug("");
    setError("");
  };

  return (
    <div>
      <h1 className="text-2xl font-serif tracking-wide mb-8">Brands</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* List */}
        <div className="lg:col-span-2">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-[#d49f37] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="bg-white/[0.02] border border-white/5 rounded-xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left px-6 py-4 text-[11px] uppercase tracking-widest text-white/30 font-medium">Name</th>
                    <th className="text-left px-6 py-4 text-[11px] uppercase tracking-widest text-white/30 font-medium">Slug</th>
                    <th className="text-left px-6 py-4 text-[11px] uppercase tracking-widest text-white/30 font-medium">Products</th>
                    <th className="text-right px-6 py-4 text-[11px] uppercase tracking-widest text-white/30 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {brands.map((brand) => (
                    <tr key={brand.id} className="border-b border-white/[0.03]">
                      <td className="px-6 py-4 text-white text-sm font-medium">{brand.name}</td>
                      <td className="px-6 py-4 text-white/40 text-sm">{brand.slug}</td>
                      <td className="px-6 py-4 text-white/60 text-sm">{brand._count?.products || 0}</td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => handleEdit(brand)} className="text-white/40 hover:text-white text-xs mr-4">Edit</button>
                        <button onClick={() => handleDelete(brand.id)} className="text-white/40 hover:text-red-400">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {brands.length === 0 && (
                    <tr>
                      <td colSpan={3} className="px-6 py-8 text-center text-white/30 text-sm">No brands yet</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Add Form */}
        <div>
          <div className="bg-white/[0.02] border border-white/5 rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-semibold text-white">
                {editingId ? "Edit Brand" : "Add New Brand"}
              </h3>
              {editingId && (
                <button type="button" onClick={resetForm} className="text-xs text-white/50 hover:text-white">Cancel</button>
              )}
            </div>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-[11px] uppercase tracking-widest text-white/40 mb-2">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Timemore"
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#d49f37]"
                />
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-widest text-white/40 mb-2">Slug</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="timemore"
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#d49f37]"
                />
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-widest text-white/40 mb-2">Arabic Name</label>
                <input
                  type="text"
                  value={nameAr}
                  onChange={(e) => setNameAr(e.target.value)}
                  placeholder="تايمور"
                  dir="rtl"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#d49f37]"
                />
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-widest text-white/40 mb-2">Kurdish Name</label>
                <input
                  type="text"
                  value={nameKu}
                  onChange={(e) => setNameKu(e.target.value)}
                  placeholder="تایمۆر"
                  dir="rtl"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#d49f37]"
                />
              </div>
              {error && <p className="text-red-400 text-xs">{error}</p>}
              <button
                type="submit"
                disabled={adding || !name || !slug}
                className="w-full flex items-center justify-center gap-2 py-3 bg-[#d49f37] hover:bg-[#B8965E] disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition-colors mt-2"
              >
                {!editingId && <Plus size={16} />}
                {adding ? "Saving..." : editingId ? "Update Brand" : "Add Brand"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
