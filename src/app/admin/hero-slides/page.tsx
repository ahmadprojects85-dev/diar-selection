"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, ImagePlus, ArrowUp, ArrowDown, Edit2, Check, X, Eye, EyeOff } from "lucide-react";
import Image from "next/image";

interface HeroSlide {
  id: string;
  image: string;
  mobileImage?: string;
  textEn?: string;
  textAr?: string;
  textKu?: string;
  textKm?: string;
  buttonLink?: string;
  sortOrder: number;
  isActive: boolean;
}

export default function AdminHeroSlidesPage() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [form, setForm] = useState({
    image: "",
    mobileImage: "",
    textEn: "",
    textAr: "",
    textKu: "",
    textKm: "",
    buttonLink: "/products",
    sortOrder: "0",
    isActive: true,
  });

  const [uploading, setUploading] = useState(false);
  const [uploadingMobile, setUploadingMobile] = useState(false);
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const fetchSlides = () => {
    setLoading(true);
    fetch("/api/hero-slides", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => setSlides(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isMobile = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (isMobile) {
      setUploadingMobile(true);
    } else {
      setUploading(true);
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      if (isMobile) {
        setForm((prev) => ({ ...prev, mobileImage: data.url }));
      } else {
        setForm((prev) => ({ ...prev, image: data.url }));
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Failed to upload file");
    } finally {
      if (isMobile) {
        setUploadingMobile(false);
      } else {
        setUploading(false);
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.image) {
      setError("Please select or upload a desktop image");
      return;
    }
    setAdding(true);
    setError("");

    try {
      const url = editingId ? `/api/hero-slides/${editingId}` : "/api/hero-slides";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to save slide");
      }

      // Reset form
      setForm({
        image: "",
        mobileImage: "",
        textEn: "",
        textAr: "",
        textKu: "",
        textKm: "",
        buttonLink: "/products",
        sortOrder: String(slides.length),
        isActive: true,
      });
      setEditingId(null);
      fetchSlides();
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setAdding(false);
    }
  };

  const handleEdit = (slide: HeroSlide) => {
    setEditingId(slide.id);
    setForm({
      image: slide.image || "",
      mobileImage: slide.mobileImage || "",
      textEn: slide.textEn || "",
      textAr: slide.textAr || "",
      textKu: slide.textKu || "",
      textKm: slide.textKm || "",
      buttonLink: slide.buttonLink || "/products",
      sortOrder: String(slide.sortOrder || 0),
      isActive: slide.isActive !== false,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm({
      image: "",
      mobileImage: "",
      textEn: "",
      textAr: "",
      textKu: "",
      textKm: "",
      buttonLink: "/products",
      sortOrder: "0",
      isActive: true,
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this slide?")) return;

    try {
      const res = await fetch(`/api/hero-slides/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete slide");

      setSlides((prev) => prev.filter((item) => item.id !== id));
      if (editingId === id) handleCancelEdit();
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete slide");
    }
  };

  const handleToggleActive = async (slide: HeroSlide) => {
    try {
      const updatedStatus = !slide.isActive;
      const res = await fetch(`/api/hero-slides/${slide.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: updatedStatus }),
      });

      if (!res.ok) throw new Error("Failed to toggle status");

      setSlides((prev) =>
        prev.map((s) => (s.id === slide.id ? { ...s, isActive: updatedStatus } : s))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleMoveOrder = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= slides.length) return;

    const currentSlide = slides[index];
    const targetSlide = slides[targetIndex];

    try {
      await Promise.all([
        fetch(`/api/hero-slides/${currentSlide.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sortOrder: targetSlide.sortOrder }),
        }),
        fetch(`/api/hero-slides/${targetSlide.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sortOrder: currentSlide.sortOrder }),
        }),
      ]);

      fetchSlides();
    } catch (err) {
      console.error("Reorder failed:", err);
    }
  };

  return (
    <div className="p-6 lg:p-10 max-w-6xl mx-auto space-y-10">
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl font-bold tracking-tight text-white mb-2">
          Homepage Hero Slides Management
        </h1>
        <p className="text-sm text-white/50">
          Add, edit, reorder, and toggle the full-screen slides displayed on your homepage slider.
        </p>
      </div>

      {/* Slide Add/Edit Form */}
      <div className="bg-[#141414] rounded-2xl p-6 border border-white/10 shadow-xl space-y-6">
        <h2 className="text-lg font-semibold text-white flex items-center justify-between">
          <span>{editingId ? "Edit Hero Slide" : "Add New Hero Slide"}</span>
          {editingId && (
            <button
              onClick={handleCancelEdit}
              className="text-xs text-white/50 hover:text-white flex items-center gap-1 cursor-pointer"
            >
              <X size={14} /> Cancel Editing
            </button>
          )}
        </h2>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* Desktop Image Selection & Preview */}
          <div className="space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-white/70">
                Desktop Background Image *
              </label>
              <span className="text-[11px] text-[#d49f37] font-medium bg-[#d49f37]/10 px-2 py-0.5 rounded w-fit">
                Recommended: 1920 × 1080 px (16:9 Landscape)
              </span>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {form.image ? (
                <div className="relative w-48 h-28 rounded-xl overflow-hidden border border-white/20 group">
                  <Image
                    src={form.image}
                    alt="Slide preview"
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, image: "" }))}
                    className="absolute top-2 right-2 bg-black/70 p-1.5 rounded-full text-white hover:bg-red-600 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <div className="w-48 h-28 rounded-xl bg-white/5 border border-dashed border-white/20 flex flex-col items-center justify-center text-white/40 text-xs gap-2">
                  <ImagePlus size={24} />
                  <span>No image selected</span>
                </div>
              )}

              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  placeholder="Or enter desktop image URL (e.g. /hero-luxury-v3.webp or Cloudinary URL)"
                  value={form.image}
                  onChange={(e) => setForm((p) => ({ ...p, image: e.target.value }))}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#d49f37]"
                />
                <div className="flex items-center gap-3">
                  <label className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors inline-flex items-center gap-2">
                    <ImagePlus size={14} />
                    <span>{uploading ? "Uploading..." : "Upload Desktop Image"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, false)}
                      disabled={uploading}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Image Selection & Preview (Optional vertical/portrait photo for phone screens) */}
          <div className="space-y-2 pt-2 border-t border-white/10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#d49f37]">
                Mobile Background Image (Optional for Phone Screens)
              </label>
              <span className="text-[11px] text-[#d49f37] font-medium bg-[#d49f37]/10 px-2 py-0.5 rounded w-fit">
                Recommended: 1080 × 1920 px (9:16 Portrait Aspect Ratio)
              </span>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {form.mobileImage ? (
                <div className="relative w-24 h-36 rounded-xl overflow-hidden border border-white/20 group">
                  <Image
                    src={form.mobileImage}
                    alt="Mobile slide preview"
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, mobileImage: "" }))}
                    className="absolute top-2 right-2 bg-black/70 p-1.5 rounded-full text-white hover:bg-red-600 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <div className="w-24 h-36 rounded-xl bg-white/5 border border-dashed border-white/20 flex flex-col items-center justify-center text-white/40 text-xs gap-2 text-center p-2">
                  <ImagePlus size={20} />
                  <span>No mobile image</span>
                </div>
              )}

              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  placeholder="Or enter mobile image URL (e.g. portrait photo optimized for phones)"
                  value={form.mobileImage}
                  onChange={(e) => setForm((p) => ({ ...p, mobileImage: e.target.value }))}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#d49f37]"
                />
                <div className="flex items-center gap-3">
                  <label className="bg-[#d49f37]/20 hover:bg-[#d49f37]/30 text-[#d49f37] px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors inline-flex items-center gap-2 border border-[#d49f37]/40">
                    <ImagePlus size={14} />
                    <span>{uploadingMobile ? "Uploading..." : "Upload Mobile Portrait Image"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, true)}
                      disabled={uploadingMobile}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Localized Descriptions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Kurdish Sorani Text */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-white/70">
                Kurdish Sorani (کوردی سۆرانی)
              </label>
              <textarea
                rows={3}
                placeholder="هەڵبژاردنی کەرەستەی دروستکردنی قاوە..."
                value={form.textKu}
                onChange={(e) => setForm((p) => ({ ...p, textKu: e.target.value }))}
                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#d49f37]"
                dir="rtl"
              />
            </div>

            {/* Kurdish Kurmanji Text */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-white/70">
                Kurdish Kurmanji (کوردی کرمانجی)
              </label>
              <textarea
                rows={3}
                placeholder="Hildibijêrina keresteyên amadekirina qahwê..."
                value={form.textKm}
                onChange={(e) => setForm((p) => ({ ...p, textKm: e.target.value }))}
                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#d49f37]"
              />
            </div>

            {/* Arabic Text */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-white/70">
                Arabic Text (العربية)
              </label>
              <textarea
                rows={3}
                placeholder="اختيار معدات وطرق تحضير القهوة..."
                value={form.textAr}
                onChange={(e) => setForm((p) => ({ ...p, textAr: e.target.value }))}
                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#d49f37]"
                dir="rtl"
              />
            </div>

            {/* English Text */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-white/70">
                English Text
              </label>
              <textarea
                rows={3}
                placeholder="Curating specialty coffee tools..."
                value={form.textEn}
                onChange={(e) => setForm((p) => ({ ...p, textEn: e.target.value }))}
                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#d49f37]"
              />
            </div>
          </div>

          {/* Button Link & Settings */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-white/70">
                Button Link / URL
              </label>
              <input
                type="text"
                value={form.buttonLink}
                onChange={(e) => setForm((p) => ({ ...p, buttonLink: e.target.value }))}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#d49f37]"
                placeholder="/products"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-white/70">
                Sort Order (Lower = Shows First)
              </label>
              <input
                type="number"
                value={form.sortOrder}
                onChange={(e) => setForm((p) => ({ ...p, sortOrder: e.target.value }))}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#d49f37]"
              />
            </div>

            <div className="flex items-center gap-3 pt-6">
              <label className="flex items-center gap-2 text-sm text-white/90 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))}
                  className="w-4 h-4 rounded accent-[#d49f37]"
                />
                <span>Active on Homepage</span>
              </label>
            </div>
          </div>

          {/* Form Action Button */}
          <div className="flex justify-end gap-3 pt-2">
            {editingId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-semibold transition-colors"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={adding}
              className="px-6 py-2.5 bg-[#d49f37] hover:bg-[#c3902e] text-black font-bold rounded-xl text-sm transition-colors flex items-center gap-2 cursor-pointer shadow-lg"
            >
              {editingId ? <Check size={16} /> : <Plus size={16} />}
              <span>{editingId ? "Update Slide" : "Add Slide"}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Existing Slides List */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center justify-between">
          <span>Active Slides ({slides.length})</span>
        </h2>

        {loading ? (
          <div className="py-12 text-center text-white/40">Loading slides...</div>
        ) : slides.length === 0 ? (
          <div className="bg-[#141414] rounded-2xl p-12 text-center text-white/40 border border-white/5">
            No custom slides created yet. The default slides will be shown on the homepage.
          </div>
        ) : (
          <div className="space-y-3">
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className={`bg-[#141414] rounded-2xl p-4 sm:p-5 border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors ${
                  slide.isActive ? "border-white/10 hover:border-white/20" : "border-red-500/20 opacity-60 bg-red-500/5"
                }`}
              >
                {/* Slide Preview & Information */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1">
                  {/* Both Laptop & Mobile Image Previews */}
                  <div className="flex items-center gap-2 shrink-0">
                    {/* Laptop / PC Image Thumbnail */}
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-[9px] font-semibold uppercase tracking-wider text-white/50 bg-white/5 px-1.5 py-0.5 rounded">
                        Laptop / PC
                      </span>
                      <div className="relative w-24 h-15 rounded-lg overflow-hidden border border-white/15 bg-black/50">
                        <Image
                          src={slide.image}
                          alt="Laptop slide preview"
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>

                    {/* Mobile Image Thumbnail */}
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-[9px] font-semibold uppercase tracking-wider text-[#d49f37] bg-[#d49f37]/10 px-1.5 py-0.5 rounded">
                        Mobile
                      </span>
                      <div className="relative w-10 h-15 rounded-lg overflow-hidden border border-[#d49f37]/30 bg-black/50">
                        {slide.mobileImage ? (
                          <Image
                            src={slide.mobileImage}
                            alt="Mobile slide preview"
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[9px] text-white/30 text-center leading-none p-0.5">
                            Auto (PC)
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-[#d49f37] bg-[#d49f37]/10 px-2 py-0.5 rounded">
                        #{index + 1} (Order: {slide.sortOrder})
                      </span>
                      {!slide.isActive && (
                        <span className="text-[10px] uppercase font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded">
                          Inactive
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-white line-clamp-1 font-medium">
                      {slide.textKu || slide.textEn || slide.textAr || "No description text"}
                    </p>
                    <p className="text-xs text-white/40">
                      Link: <span className="text-white/70">{slide.buttonLink || "/products"}</span>
                    </p>
                  </div>
                </div>

                {/* Actions: Reorder, Active Toggle, Edit, Delete */}
                <div className="flex items-center gap-2 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-white/5">
                  <button
                    onClick={() => handleMoveOrder(index, "up")}
                    disabled={index === 0}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    title="Move Up"
                  >
                    <ArrowUp size={16} />
                  </button>

                  <button
                    onClick={() => handleMoveOrder(index, "down")}
                    disabled={index === slides.length - 1}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    title="Move Down"
                  >
                    <ArrowDown size={16} />
                  </button>

                  <button
                    onClick={() => handleToggleActive(slide)}
                    className={`p-2 rounded-lg transition-colors ${
                      slide.isActive
                        ? "bg-green-500/10 text-green-400 hover:bg-green-500/20"
                        : "bg-white/5 text-white/40 hover:bg-white/10"
                    }`}
                    title={slide.isActive ? "Deactivate Slide" : "Activate Slide"}
                  >
                    {slide.isActive ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>

                  <button
                    onClick={() => handleEdit(slide)}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                    title="Edit Slide"
                  >
                    <Edit2 size={16} />
                  </button>

                  <button
                    onClick={() => handleDelete(slide.id)}
                    className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                    title="Delete Slide"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
