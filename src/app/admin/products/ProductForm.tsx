"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, ImagePlus, X, Plus } from "lucide-react";
import Link from "next/link";

interface Category {
  id: string;
  name: string;
}

interface Brand {
  id: string;
  name: string;
}

interface BrewingMethod {
  id: string;
  name: string;
}

interface ProductFormProps {
  productId?: string; // If editing
}

export function ProductForm({ productId }: ProductFormProps) {
  const router = useRouter();
  const isEditing = !!productId;

  const [categories, setCategories] = useState<Category[]>([]);
  const [brewingMethods, setBrewingMethods] = useState<BrewingMethod[]>([]);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [extraImages, setExtraImages] = useState<string[]>([]);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    nameAr: "",
    nameKu: "",
    slug: "",
    description: "",
    descriptionAr: "",
    descriptionKu: "",
    longDescription: "",
    longDescriptionAr: "",
    longDescriptionKu: "",
    price: "",
    originalPrice: "",
    currency: "IQD",
    image: "",
    categoryId: "",
    brewingMethodId: "",
    isBestSeller: false,
    inStock: true,
    sortOrder: "0",
  });

  // Fetch categories and brewing methods
  useEffect(() => {
    Promise.all([
      fetch("/api/categories").then((r) => r.json()),
      fetch("/api/brewing-methods").then((r) => r.json()),
    ]).then(([cats, methods]) => {
      setCategories(Array.isArray(cats) ? cats : []);
      setBrewingMethods(Array.isArray(methods) ? methods : []);
    });
  }, []);

  // Fetch product data if editing
  useEffect(() => {
    if (!productId) return;
    fetch(`/api/products/${productId}`)
      .then((r) => r.json())
      .then((product) => {
        setForm({
          name: product.name || "",
          nameAr: product.nameAr || "",
          nameKu: product.nameKu || "",
          slug: product.slug || "",
          description: product.description || "",
          descriptionAr: product.descriptionAr || "",
          descriptionKu: product.descriptionKu || "",
          longDescription: product.longDescription || "",
          longDescriptionAr: product.longDescriptionAr || "",
          longDescriptionKu: product.longDescriptionKu || "",
          price: String(product.price || ""),
          originalPrice: product.originalPrice
            ? String(product.originalPrice)
            : "",
          currency: product.currency || "IQD",
          image: product.image || "",
          categoryId: product.categoryId || "",
          brewingMethodId: product.brewingMethodId || "",
          isBestSeller: product.isBestSeller || false,
          inStock: product.inStock !== false,
          sortOrder: String(product.sortOrder || "0"),
        });
        // Load existing gallery images
        if (product.images) {
          try {
            const parsed = typeof product.images === "string" ? JSON.parse(product.images) : product.images;
            if (Array.isArray(parsed)) setExtraImages(parsed);
          } catch { /* ignore parse errors */ }
        }
      });
  }, [productId]);

  // Auto-generate slug from name
  const handleNameChange = (name: string) => {
    setForm((prev) => ({
      ...prev,
      name,
      slug: isEditing
        ? prev.slug
        : name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, ""),
    }));
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
        throw new Error("Failed to upload file");
      }

      const data = await res.json();
      setForm((prev) => ({ ...prev, image: data.url }));
    } catch (err: any) {
      setError(err.message || "Something went wrong uploading the file.");
    } finally {
      setUploading(false);
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingGallery(true);
    setError("");

    try {
      const uploadedUrls: string[] = [];
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        if (!res.ok) throw new Error("Failed to upload file");
        const data = await res.json();
        uploadedUrls.push(data.url);
      }
      setExtraImages((prev) => [...prev, ...uploadedUrls]);
    } catch (err: any) {
      setError(err.message || "Something went wrong uploading gallery images.");
    } finally {
      setUploadingGallery(false);
      // Reset the file input so the same file can be re-selected
      e.target.value = "";
    }
  };

  const removeGalleryImage = (index: number) => {
    setExtraImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const url = isEditing ? `/api/products/${productId}` : "/api/products";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: parseFloat(form.price),
          originalPrice: form.originalPrice
            ? parseFloat(form.originalPrice)
            : null,
          sortOrder: form.sortOrder ? parseInt(form.sortOrder) : 0,
          images: extraImages.length > 0 ? extraImages : null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save");
      }

      router.push("/admin/products");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/products"
          className="p-2 text-white/30 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-serif tracking-wide">
          {isEditing ? "Edit Product" : "New Product"}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="max-w-3xl">
        <div className="space-y-8">
          {/* Basic Info */}
          <div className="bg-white/[0.02] border border-white/5 rounded-xl p-6 space-y-5">
            <h3 className="text-xs uppercase tracking-widest text-white/30 font-medium">
              Basic Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-[11px] uppercase tracking-widest text-white/40 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Timemore C3 Grinder"
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/15 focus:outline-none focus:border-[#d49f37] transition-colors text-sm"
                />
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-widest text-white/40 mb-2">
                  Slug *
                </label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, slug: e.target.value }))
                  }
                  placeholder="timemore-c3-grinder"
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/15 focus:outline-none focus:border-[#d49f37] transition-colors text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-[11px] uppercase tracking-widest text-white/40 mb-2">
                  Arabic Name
                </label>
                <input
                  type="text"
                  value={form.nameAr}
                  onChange={(e) => setForm((prev) => ({ ...prev, nameAr: e.target.value }))}
                  placeholder="الاسم بالعربية"
                  dir="rtl"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/15 focus:outline-none focus:border-[#d49f37] transition-colors text-sm"
                />
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-widest text-white/40 mb-2">
                  Kurdish Name
                </label>
                <input
                  type="text"
                  value={form.nameKu}
                  onChange={(e) => setForm((prev) => ({ ...prev, nameKu: e.target.value }))}
                  placeholder="ناوی کوردی"
                  dir="rtl"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/15 focus:outline-none focus:border-[#d49f37] transition-colors text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-widest text-white/40 mb-2">
                English Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, description: e.target.value }))
                }
                rows={4}
                placeholder="Describe the product..."
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/15 focus:outline-none focus:border-[#d49f37] transition-colors text-sm resize-none"
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-[11px] uppercase tracking-widest text-white/40 mb-2">
                  Arabic Description
                </label>
                <textarea
                  value={form.descriptionAr}
                  onChange={(e) => setForm((prev) => ({ ...prev, descriptionAr: e.target.value }))}
                  rows={3}
                  placeholder="الوصف بالعربية..."
                  dir="rtl"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/15 focus:outline-none focus:border-[#d49f37] transition-colors text-sm resize-none"
                />
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-widest text-white/40 mb-2">
                  Kurdish Description
                </label>
                <textarea
                  value={form.descriptionKu}
                  onChange={(e) => setForm((prev) => ({ ...prev, descriptionKu: e.target.value }))}
                  rows={3}
                  placeholder="وەسفی بەرهەم بە کوردی..."
                  dir="rtl"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/15 focus:outline-none focus:border-[#d49f37] transition-colors text-sm resize-none"
                />
              </div>
            </div>

            {/* Long Descriptions */}
            <div className="border-t border-white/5 pt-5 mt-5 space-y-5">
              <h4 className="text-white/80 font-medium text-sm">External / Long Description</h4>
              
              <div>
                <label className="block text-[11px] uppercase tracking-widest text-white/40 mb-2">
                  Long Description (English)
                </label>
                <textarea
                  value={form.longDescription}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, longDescription: e.target.value }))
                  }
                  rows={6}
                  placeholder="Extended description shown below the main product section..."
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/15 focus:outline-none focus:border-[#d49f37] transition-colors text-sm resize-y"
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[11px] uppercase tracking-widest text-white/40 mb-2">
                    Long Description (Arabic)
                  </label>
                  <textarea
                    value={form.longDescriptionAr}
                    onChange={(e) => setForm((prev) => ({ ...prev, longDescriptionAr: e.target.value }))}
                    rows={6}
                    placeholder="الوصف التفصيلي بالعربية..."
                    dir="rtl"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/15 focus:outline-none focus:border-[#d49f37] transition-colors text-sm resize-y"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-widest text-white/40 mb-2">
                    Long Description (Kurdish)
                  </label>
                  <textarea
                    value={form.longDescriptionKu}
                    onChange={(e) => setForm((prev) => ({ ...prev, longDescriptionKu: e.target.value }))}
                    rows={6}
                    placeholder="وەسفی درێژ بە کوردی..."
                    dir="rtl"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/15 focus:outline-none focus:border-[#d49f37] transition-colors text-sm resize-y"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white/[0.02] border border-white/5 rounded-xl p-6 space-y-5">
            <h3 className="text-xs uppercase tracking-widest text-white/30 font-medium">
              Pricing
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className="block text-[11px] uppercase tracking-widest text-white/40 mb-2">
                  Price *
                </label>
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, price: e.target.value }))
                  }
                  placeholder="85000"
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/15 focus:outline-none focus:border-[#d49f37] transition-colors text-sm"
                />
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-widest text-white/40 mb-2">
                  Original Price
                </label>
                <input
                  type="number"
                  value={form.originalPrice}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      originalPrice: e.target.value,
                    }))
                  }
                  placeholder="100000"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/15 focus:outline-none focus:border-[#d49f37] transition-colors text-sm"
                />
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-widest text-white/40 mb-2">
                  Currency
                </label>
                <select
                  value={form.currency}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, currency: e.target.value }))
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#d49f37] transition-colors text-sm"
                >
                  <option value="IQD" className="bg-[#111111] text-white">IQD (Iraqi Dinar)</option>
                  <option value="USD" className="bg-[#111111] text-white">USD (US Dollar)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="bg-white/[0.02] border border-white/5 rounded-xl p-6 space-y-5">
            <h3 className="text-xs uppercase tracking-widest text-white/30 font-medium">
              Image
            </h3>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-[11px] uppercase tracking-widest text-white/40 mb-2">
                  Image URL *
                </label>
                <input
                  type="text"
                  value={form.image}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, image: e.target.value }))
                  }
                  placeholder="https://... or upload a file"
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/15 focus:outline-none focus:border-[#d49f37] transition-colors text-sm"
                />
              </div>
              <div className="flex-none">
                <label className="block text-[11px] uppercase tracking-widest text-white/40 mb-2">
                  Or Upload File
                </label>
                <label className="flex items-center justify-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#d49f37] rounded-lg text-white cursor-pointer transition-colors text-sm whitespace-nowrap h-[46px]">
                  {uploading ? (
                    <span className="animate-pulse">Uploading...</span>
                  ) : (
                    <>
                      <ImagePlus size={16} />
                      Choose File
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleFileUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
            {form.image && (
              <div className="w-32 h-32 rounded-lg overflow-hidden bg-white/5">
                <img
                  src={form.image}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Additional Gallery Images */}
            <div className="border-t border-white/5 pt-5">
              <label className="block text-[11px] uppercase tracking-widest text-white/40 mb-3">
                Additional Images (Gallery)
              </label>
              <div className="flex flex-wrap gap-3">
                {extraImages.map((img, index) => (
                  <div key={index} className="relative group w-24 h-24 rounded-lg overflow-hidden bg-white/5 border border-white/10">
                    <img src={img} alt={`Gallery ${index + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeGalleryImage(index)}
                      className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500/80 hover:bg-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={12} className="text-white" />
                    </button>
                  </div>
                ))}
                {/* Add button */}
                <label className="w-24 h-24 rounded-lg border-2 border-dashed border-white/10 hover:border-[#d49f37]/50 flex flex-col items-center justify-center cursor-pointer transition-colors group">
                  {uploadingGallery ? (
                    <span className="text-[10px] text-white/30 animate-pulse">Uploading...</span>
                  ) : (
                    <>
                      <Plus size={20} className="text-white/20 group-hover:text-[#d49f37] transition-colors" />
                      <span className="text-[9px] text-white/20 mt-1 group-hover:text-white/40 transition-colors">Add More</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleGalleryUpload}
                    disabled={uploadingGallery}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Category & Brand */}
          <div className="bg-white/[0.02] border border-white/5 rounded-xl p-6 space-y-5">
            <h3 className="text-xs uppercase tracking-widest text-white/30 font-medium">
              Organization
            </h3>
            <div className="grid grid-cols-1 gap-5">
              <div>
                <label className="block text-[11px] uppercase tracking-widest text-white/40 mb-2">
                  Category *
                </label>
                <select
                  value={form.categoryId}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      categoryId: e.target.value,
                    }))
                  }
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#d49f37] transition-colors text-sm"
                >
                  <option value="" className="bg-[#111111] text-white">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id} className="bg-[#111111] text-white">
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Options */}
          <div className="bg-white/[0.02] border border-white/5 rounded-xl p-6 space-y-5">
            <h3 className="text-xs uppercase tracking-widest text-white/30 font-medium">
              Options
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isBestSeller}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      isBestSeller: e.target.checked,
                    }))
                  }
                  className="w-4 h-4 accent-[#d49f37]"
                />
                <span className="text-white/60 text-sm">Best Seller</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.inStock}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      inStock: e.target.checked,
                    }))
                  }
                  className="w-4 h-4 accent-[#d49f37]"
                />
                <span className="text-white/60 text-sm">In Stock</span>
              </label>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Submit */}
          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-8 py-3 bg-[#d49f37] hover:bg-[#B8965E] disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              <Save size={18} />
              {saving
                ? "Saving..."
                : isEditing
                ? "Update Product"
                : "Create Product"}
            </button>
            <Link
              href="/admin/products"
              className="px-6 py-3 text-white/40 hover:text-white text-sm transition-colors"
            >
              Cancel
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
