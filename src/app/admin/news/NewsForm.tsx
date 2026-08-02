"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, ImagePlus } from "lucide-react";
import Link from "next/link";

interface NewsFormProps {
  newsId?: string;
}

export function NewsForm({ newsId }: NewsFormProps) {
  const router = useRouter();
  const isEditing = !!newsId;

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [extraImages, setExtraImages] = useState<string[]>([]);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    titleAr: "",
    titleKu: "",
    titleKm: "",
    excerpt: "",
    excerptAr: "",
    excerptKu: "",
    excerptKm: "",
    tag: "",
    tagAr: "",
    tagKu: "",
    tagKm: "",
    image: "",
    isFeatured: false,
    sortOrder: "0",
  });

  useEffect(() => {
    if (!newsId) return;
    fetch(`/api/news/${newsId}`)
      .then((r) => r.json())
      .then((news) => {
        setForm({
          title: news.title || "",
          titleAr: news.titleAr || "",
          titleKu: news.titleKu || "",
          titleKm: news.titleKm || "",
          excerpt: news.excerpt || "",
          excerptAr: news.excerptAr || "",
          excerptKu: news.excerptKu || "",
          excerptKm: news.excerptKm || "",
          tag: news.tag || "",
          tagAr: news.tagAr || "",
          tagKu: news.tagKu || "",
          tagKm: news.tagKm || "",
          image: news.image || "",
          isFeatured: news.isFeatured || false,
          sortOrder: String(news.sortOrder || "0"),
        });

        if (news.images) {
          try {
            const parsed = typeof news.images === "string" ? JSON.parse(news.images) : news.images;
            if (Array.isArray(parsed)) {
              setExtraImages(parsed);
            }
          } catch (e) {
            console.error("Failed to parse gallery images:", e);
          }
        }
      });
  }, [newsId]);

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
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploadingGallery(true);
    setError("");

    try {
      const uploadedUrls: string[] = [];

      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        if (!res.ok) throw new Error("Failed to upload image");
        const data = await res.json();
        uploadedUrls.push(data.url);
      }

      setExtraImages((prev) => [...prev, ...uploadedUrls]);
    } catch (err: any) {
      setError(err.message || "Failed to upload gallery images");
    } finally {
      setUploadingGallery(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.excerpt || !form.image || !form.tag) {
      setError("Please fill out all required fields (Title, Excerpt, Tag, Image)");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const url = isEditing ? `/api/news/${newsId}` : "/api/news";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          images: JSON.stringify(extraImages),
          sortOrder: parseInt(form.sortOrder) || 0,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save news article");
      }

      router.push("/admin/news");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/news"
            className="p-2 hover:bg-white/5 rounded-full transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-serif tracking-wide">
            {isEditing ? "Edit News Article" : "Add News Article"}
          </h1>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 bg-[#d49f37] text-black px-6 py-2 rounded-lg font-medium hover:bg-[#b58529] transition-colors disabled:opacity-50"
        >
          <Save size={18} />
          {saving ? "Saving..." : "Save Article"}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form Fields */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#121212] p-6 rounded-xl border border-white/5 space-y-6">
            <h2 className="text-lg font-medium mb-4">Content</h2>
            
            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm text-white/50 mb-2">Title (EN) *</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#d49f37]"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-white/50 mb-2">Title (AR)</label>
                  <input
                    type="text"
                    value={form.titleAr}
                    onChange={(e) => setForm({ ...form, titleAr: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#d49f37]"
                    dir="rtl"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/50 mb-2">Title (KU Sorani)</label>
                  <input
                    type="text"
                    value={form.titleKu}
                    onChange={(e) => setForm({ ...form, titleKu: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#d49f37]"
                    dir="rtl"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#d49f37] mb-2 font-bold">Title (KM Kurmanji)</label>
                  <input
                    type="text"
                    value={form.titleKm}
                    onChange={(e) => setForm({ ...form, titleKm: e.target.value })}
                    className="w-full bg-black/50 border border-[#d49f37]/40 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#d49f37]"
                  />
                </div>
              </div>

              {/* Tag */}
              <div>
                <label className="block text-sm text-white/50 mb-2 mt-4">Tag / Category (EN) *</label>
                <input
                  type="text"
                  required
                  value={form.tag}
                  onChange={(e) => setForm({ ...form, tag: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#d49f37]"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-white/50 mb-2">Tag (AR)</label>
                  <input
                    type="text"
                    value={form.tagAr}
                    onChange={(e) => setForm({ ...form, tagAr: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#d49f37]"
                    dir="rtl"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/50 mb-2">Tag (KU Sorani)</label>
                  <input
                    type="text"
                    value={form.tagKu}
                    onChange={(e) => setForm({ ...form, tagKu: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#d49f37]"
                    dir="rtl"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#d49f37] mb-2 font-bold">Tag (KM Kurmanji)</label>
                  <input
                    type="text"
                    value={form.tagKm}
                    onChange={(e) => setForm({ ...form, tagKm: e.target.value })}
                    className="w-full bg-black/50 border border-[#d49f37]/40 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#d49f37]"
                  />
                </div>
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-sm text-white/50 mb-2 mt-4">Excerpt (EN) *</label>
                <textarea
                  required
                  rows={3}
                  value={form.excerpt}
                  onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#d49f37] resize-none"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-white/50 mb-2">Excerpt (AR)</label>
                  <textarea
                    rows={3}
                    value={form.excerptAr}
                    onChange={(e) => setForm({ ...form, excerptAr: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#d49f37] resize-none"
                    dir="rtl"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/50 mb-2">Excerpt (KU Sorani)</label>
                  <textarea
                    rows={3}
                    value={form.excerptKu}
                    onChange={(e) => setForm({ ...form, excerptKu: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#d49f37] resize-none"
                    dir="rtl"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#d49f37] mb-2 font-bold">Excerpt (KM Kurmanji)</label>
                  <textarea
                    rows={3}
                    value={form.excerptKm}
                    onChange={(e) => setForm({ ...form, excerptKm: e.target.value })}
                    className="w-full bg-black/50 border border-[#d49f37]/40 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#d49f37] resize-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-[#121212] p-6 rounded-xl border border-white/5 space-y-6">
            <h2 className="text-lg font-medium mb-4">Settings</h2>
            
            <label className="flex items-center gap-3 p-4 bg-black/50 border border-white/10 rounded-lg cursor-pointer">
              <input
                type="checkbox"
                checked={form.isFeatured}
                onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                className="w-5 h-5 accent-[#d49f37]"
              />
              <div>
                <div className="font-medium">Featured Article</div>
                <div className="text-xs text-white/50">Show on homepage</div>
              </div>
            </label>

            <div>
              <label className="block text-sm text-white/50 mb-2">Sort Order</label>
              <input
                type="number"
                value={form.sortOrder}
                onChange={(e) => setForm({ ...form, sortOrder: e.target.value })}
                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#d49f37]"
              />
            </div>
          </div>

          <div className="bg-[#121212] p-6 rounded-xl border border-white/5">
            <h2 className="text-lg font-medium mb-4">Cover Image *</h2>
            <div className="space-y-4">
              {form.image ? (
                <div className="relative aspect-video rounded-lg overflow-hidden border border-white/10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={form.image} alt="Article cover" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, image: "" })}
                    className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-red-500 rounded-md backdrop-blur text-white transition-colors"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center aspect-video rounded-lg border-2 border-dashed border-white/20 hover:border-[#d49f37] hover:bg-[#d49f37]/5 transition-all cursor-pointer">
                  <ImagePlus size={24} className="text-white/40 mb-2" />
                  <span className="text-sm text-white/60">
                    {uploading ? "Uploading..." : "Click to upload cover image"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Gallery / Additional Photos */}
          <div className="bg-[#121212] p-6 rounded-xl border border-white/5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium">Additional Article Photos</h2>
              <span className="text-xs text-[#d49f37] font-semibold">{extraImages.length} Photos</span>
            </div>

            {/* Gallery Upload Box */}
            <label className="flex flex-col items-center justify-center p-6 rounded-xl border-2 border-dashed border-white/20 hover:border-[#d49f37] hover:bg-[#d49f37]/5 transition-all cursor-pointer text-center">
              <ImagePlus size={24} className="text-[#d49f37] mb-2" />
              <span className="text-xs font-semibold text-white mb-1">
                {uploadingGallery ? "Uploading photos..." : "Click or Drag to Upload Multiple Article Photos"}
              </span>
              <span className="text-[10px] text-white/40">
                You can select multiple photos from your device at once
              </span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleGalleryUpload}
                disabled={uploadingGallery}
                className="hidden"
              />
            </label>

            {/* Extra Images Grid Preview */}
            {extraImages.length > 0 && (
              <div className="grid grid-cols-3 gap-3 pt-2">
                {extraImages.map((url, idx) => (
                  <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-white/10 group">
                    <img src={url} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setExtraImages((prev) => prev.filter((_, i) => i !== idx))}
                      className="absolute top-1 right-1 w-6 h-6 bg-red-500/80 hover:bg-red-600 rounded-full flex items-center justify-center text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}
