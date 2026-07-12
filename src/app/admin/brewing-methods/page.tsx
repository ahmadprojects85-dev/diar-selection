"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, ImagePlus } from "lucide-react";

interface BrewingMethod {
  id: string;
  name: string;
  nameAr?: string;
  nameKu?: string;
  tagline?: string;
  taglineAr?: string;
  taglineKu?: string;
  description?: string;
  descriptionAr?: string;
  descriptionKu?: string;
  image?: string;
  time?: string;
  sortOrder: number;
}

export default function AdminBrewingMethodsPage() {
  const [methods, setMethods] = useState<BrewingMethod[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [form, setForm] = useState({
    name: "",
    nameAr: "",
    nameKu: "",
    tagline: "",
    taglineAr: "",
    taglineKu: "",
    description: "",
    descriptionAr: "",
    descriptionKu: "",
    image: "",
    time: "",
    sortOrder: "0",
  });
  
  const [uploading, setUploading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const fetchMethods = () => {
    setLoading(true);
    fetch("/api/brewing-methods", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => setMethods(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMethods();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      setForm((prev) => ({ ...prev, image: data.url }));
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload file");
    } finally {
      setUploading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) return;
    setAdding(true);
    setError("");

    try {
      const url = editingId ? `/api/brewing-methods/${editingId}` : "/api/brewing-methods";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save brewing method");
      }

      resetForm();
      fetchMethods();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this brewing method?")) return;
    try {
      const res = await fetch(`/api/brewing-methods/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      if (editingId === id) resetForm();
      fetchMethods();
    } catch (err) {
      console.error(err);
      alert("Failed to delete method");
    }
  };

  const handleEdit = (method: any) => {
    setEditingId(method.id);
    setForm({
      name: method.name || "",
      nameAr: method.nameAr || "",
      nameKu: method.nameKu || "",
      tagline: method.tagline || "",
      taglineAr: method.taglineAr || "",
      taglineKu: method.taglineKu || "",
      description: method.description || "",
      descriptionAr: method.descriptionAr || "",
      descriptionKu: method.descriptionKu || "",
      image: method.image || "",
      time: method.time || "",
      sortOrder: String(method.sortOrder || "0"),
    });
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({
      name: "",
      nameAr: "",
      nameKu: "",
      tagline: "",
      taglineAr: "",
      taglineKu: "",
      description: "",
      descriptionAr: "",
      descriptionKu: "",
      image: "",
      time: "",
      sortOrder: "0",
    });
    setError("");
  };

  return (
    <div>
      <h1 className="text-2xl font-serif tracking-wide mb-8">Brewing Methods</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* List */}
        <div className="lg:col-span-1 border-r border-white/5 pr-4 max-h-[80vh] overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-[#d49f37] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="space-y-4">
              {methods.map((method) => (
                <div key={method.id} className="bg-white/[0.02] border border-white/5 p-4 rounded-xl flex items-center justify-between">
                  <div>
                    <h4 className="text-white text-sm font-medium">{method.name}</h4>
                    <p className="text-white/40 text-[11px] mt-1">{method.time}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => handleEdit(method)} className="text-[#d49f37] hover:text-white text-xs">Edit</button>
                    <button onClick={() => handleDelete(method.id)} className="text-red-400 hover:text-red-300">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
              {methods.length === 0 && (
                <p className="text-center text-white/30 text-sm py-10">No brewing methods yet</p>
              )}
            </div>
          )}
        </div>

        {/* Add Form */}
        <div className="lg:col-span-2">
          <div className="bg-white/[0.02] border border-white/5 rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-semibold text-white">
                {editingId ? "Edit Method" : "Add New Method"}
              </h3>
              {editingId && (
                <button type="button" onClick={resetForm} className="text-xs text-white/50 hover:text-white">Cancel</button>
              )}
            </div>
            <form onSubmit={handleAdd} className="space-y-6">
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-widest text-white/40 mb-2">Name (English) *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-[#d49f37] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-widest text-white/40 mb-2">Time (e.g. 3:00)</label>
                  <input
                    type="text"
                    value={form.time}
                    onChange={(e) => setForm({ ...form, time: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-[#d49f37] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-widest text-white/40 mb-2">Name (Arabic)</label>
                  <input type="text" dir="rtl" value={form.nameAr} onChange={(e) => setForm({ ...form, nameAr: e.target.value })} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-[#d49f37] outline-none" />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-widest text-white/40 mb-2">Name (Kurdish)</label>
                  <input type="text" dir="rtl" value={form.nameKu} onChange={(e) => setForm({ ...form, nameKu: e.target.value })} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-[#d49f37] outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-widest text-white/40 mb-2">Tagline (English)</label>
                <input type="text" value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-[#d49f37] outline-none" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-widest text-white/40 mb-2">Tagline (Arabic)</label>
                  <input type="text" dir="rtl" value={form.taglineAr} onChange={(e) => setForm({ ...form, taglineAr: e.target.value })} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-[#d49f37] outline-none" />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-widest text-white/40 mb-2">Tagline (Kurdish)</label>
                  <input type="text" dir="rtl" value={form.taglineKu} onChange={(e) => setForm({ ...form, taglineKu: e.target.value })} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-[#d49f37] outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-widest text-white/40 mb-2">Description (English)</label>
                <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-[#d49f37] outline-none" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-widest text-white/40 mb-2">Description (Arabic)</label>
                  <textarea rows={3} dir="rtl" value={form.descriptionAr} onChange={(e) => setForm({ ...form, descriptionAr: e.target.value })} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-[#d49f37] outline-none" />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-widest text-white/40 mb-2">Description (Kurdish)</label>
                  <textarea rows={3} dir="rtl" value={form.descriptionKu} onChange={(e) => setForm({ ...form, descriptionKu: e.target.value })} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-[#d49f37] outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-widest text-white/40 mb-2">Media File (Video/Image)</label>
                <div className="flex gap-4 items-center">
                  <label className="flex items-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg cursor-pointer text-sm transition-colors text-white">
                    {uploading ? "Uploading..." : <><ImagePlus size={16} /> Choose File</>}
                    <input type="file" accept="image/*,video/*" onChange={handleFileUpload} disabled={uploading} className="hidden" />
                  </label>
                  <input type="text" placeholder="Or enter URL" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-[#d49f37] outline-none" />
                </div>
              </div>

              {error && <p className="text-red-400 text-xs">{error}</p>}
              
              <button
                type="submit"
                disabled={adding || !form.name}
                className="w-full flex items-center justify-center gap-2 py-3 bg-[#d49f37] hover:bg-[#B8965E] disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                {!editingId && <Plus size={16} />}
                {adding ? "Saving..." : editingId ? "Update Method" : "Add Method"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
