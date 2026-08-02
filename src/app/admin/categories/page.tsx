"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, ImagePlus, Coffee } from "lucide-react";

interface Category {
  id: string;
  name: string;
  nameAr?: string;
  nameKu?: string;
  nameKm?: string;
  slug: string;
  image?: string | null;
  _count?: { products: number };
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [name, setName] = useState("");
  const [nameAr, setNameAr] = useState("");
  const [nameKu, setNameKu] = useState("");
  const [nameKm, setNameKm] = useState("");
  const [slug, setSlug] = useState("");
  const [image, setImage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const fetchCategories = () => {
    setLoading(true);
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleNameChange = (val: string) => {
    setName(val);
    setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await res.json();
      setImage(data.url);
    } catch (err: any) {
      setError(err.message || "Failed to upload file");
    } finally {
      setUploading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !slug) return;
    setAdding(true);
    setError("");

    try {
      const url = editingId ? `/api/categories/${editingId}` : "/api/categories";
      const method = editingId ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, nameAr, nameKu, nameKm, slug, image }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save category");
      }

      resetForm();
      fetchCategories();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      if (editingId === id) resetForm();
      fetchCategories();
    } catch (err) {
      console.error(err);
      alert("Failed to delete category");
    }
  };

  const handleEdit = (cat: any) => {
    setEditingId(cat.id);
    setName(cat.name);
    setNameAr(cat.nameAr || "");
    setNameKu(cat.nameKu || "");
    setNameKm(cat.nameKm || "");
    setSlug(cat.slug);
    setImage(cat.image || "");
    setError("");
  };

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setNameAr("");
    setNameKu("");
    setNameKm("");
    setSlug("");
    setImage("");
    setError("");
  };

  return (
    <div>
      <h1 className="text-2xl font-serif tracking-wide mb-8">Categories</h1>

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
                    <th className="text-left px-6 py-4 text-[11px] uppercase tracking-widest text-white/30 font-medium">Icon</th>
                    <th className="text-left px-6 py-4 text-[11px] uppercase tracking-widest text-white/30 font-medium">Name</th>
                    <th className="text-left px-6 py-4 text-[11px] uppercase tracking-widest text-white/30 font-medium">Slug</th>
                    <th className="text-left px-6 py-4 text-[11px] uppercase tracking-widest text-white/30 font-medium">Products</th>
                    <th className="text-right px-6 py-4 text-[11px] uppercase tracking-widest text-white/30 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat) => (
                    <tr key={cat.id} className="border-b border-white/[0.03]">
                      <td className="px-6 py-4">
                        <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
                          {cat.image ? (
                            <img
                              src={cat.image.startsWith('http') || cat.image.startsWith('/') ? cat.image : `/${cat.image}`}
                              alt={cat.name}
                              className="w-6 h-6 object-contain"
                            />
                          ) : (
                            <Coffee className="w-5 h-5 text-[#d49f37]" />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-white text-sm font-medium">{cat.name}</td>
                      <td className="px-6 py-4 text-white/40 text-sm">{cat.slug}</td>
                      <td className="px-6 py-4 text-white/60 text-sm">{cat._count?.products || 0}</td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => handleEdit(cat)} className="text-white/40 hover:text-white text-xs mr-4">Edit</button>
                        <button onClick={() => handleDelete(cat.id)} className="text-white/40 hover:text-red-400">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {categories.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-white/30 text-sm">No categories yet</td>
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
                {editingId ? "Edit Category" : "Add New Category"}
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
                  placeholder="e.g. Grinders"
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
                  placeholder="grinders"
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
                  placeholder="المطاحن"
                  dir="rtl"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#d49f37]"
                />
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-widest text-white/40 mb-2">Kurdish Sorani Name (سۆرانی)</label>
                <input
                  type="text"
                  value={nameKu}
                  onChange={(e) => setNameKu(e.target.value)}
                  placeholder="ئامێرەکانی هاڕین"
                  dir="rtl"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#d49f37]"
                />
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-widest text-[#d49f37] mb-2 font-bold">Kurdish Kurmanji Name (کرمانجی)</label>
                <input
                  type="text"
                  value={nameKm}
                  onChange={(e) => setNameKm(e.target.value)}
                  placeholder="Amrazên haڕînê"
                  className="w-full px-4 py-3 bg-white/5 border border-[#d49f37]/40 rounded-lg text-white text-sm focus:outline-none focus:border-[#d49f37]"
                />
              </div>

              {/* Category Icon / Image */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-[11px] uppercase tracking-widest text-[#d49f37] font-bold">
                    Category Icon / Image
                  </label>
                  <span className="text-[10px] text-white/40 font-mono">
                    Recommended: 64×64 px
                  </span>
                </div>

                {/* File Dropzone / Upload Box from device */}
                <div className="relative border-2 border-dashed border-white/15 hover:border-[#d49f37]/50 rounded-xl p-4 text-center transition-colors bg-white/[0.01] hover:bg-white/[0.03]">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={uploading}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
                  />
                  
                  {uploading ? (
                    <div className="flex flex-col items-center justify-center py-3">
                      <div className="w-6 h-6 border-2 border-[#d49f37] border-t-transparent rounded-full animate-spin mb-2" />
                      <span className="text-xs text-white/70">Uploading icon from device...</span>
                    </div>
                  ) : image ? (
                    <div className="flex items-center gap-3 relative z-20">
                      <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center overflow-hidden shrink-0">
                        <img
                          src={image.startsWith('http') || image.startsWith('/') ? image : `/${image}`}
                          alt="Category Icon Preview"
                          className="w-8 h-8 object-contain"
                        />
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <p className="text-xs font-semibold text-white truncate">{image.split('/').pop() || "Icon uploaded"}</p>
                        <p className="text-[10px] text-emerald-400">Icon ready</p>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setImage("");
                        }}
                        className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-medium rounded-lg transition-colors border border-red-500/20 shrink-0"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-3">
                      <div className="w-10 h-10 rounded-full bg-[#d49f37]/10 text-[#d49f37] flex items-center justify-center mb-2">
                        <ImagePlus size={20} />
                      </div>
                      <p className="text-xs font-semibold text-white mb-1">
                        Click or Drag to Upload Icon from Device
                      </p>
                      <p className="text-[10px] text-white/40">
                        Recommended: <span className="text-white/70 font-semibold">64 × 64 pixels</span> (PNG with transparent background, SVG, or WebP)
                      </p>
                    </div>
                  )}
                </div>

                {/* Optional Direct URL field */}
                <div className="mt-2">
                  <input
                    type="text"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="Or paste direct image URL (https://...)"
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-[#d49f37]"
                  />
                </div>
              </div>

              {error && <p className="text-red-400 text-xs">{error}</p>}
              <button
                type="submit"
                disabled={adding || uploading || !name || !slug}
                className="w-full flex items-center justify-center gap-2 py-3 bg-[#d49f37] hover:bg-[#B8965E] disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition-colors mt-2"
              >
                {!editingId && <Plus size={16} />}
                {adding ? "Saving..." : editingId ? "Update Category" : "Add Category"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
