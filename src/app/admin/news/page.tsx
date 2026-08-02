"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface NewsArticle {
  id: string;
  title: string;
  tag: string;
  image: string;
  isFeatured: boolean;
}

export default function AdminNewsPage() {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNews = () => {
    setLoading(true);
    fetch("/api/news")
      .then((r) => r.json())
      .then((data) => setNews(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this news article?")) return;
    try {
      const res = await fetch(`/api/news/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      fetchNews();
    } catch (err) {
      console.error(err);
      alert("Failed to delete news article");
    }
  };

  if (loading) {
    return <div className="text-white/50">Loading news...</div>;
  }

  return (
    <div className="max-w-6xl space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif tracking-wide mb-1">News & Articles</h1>
          <p className="text-white/50 text-sm">Manage coffee news and educational articles.</p>
        </div>
        <Link
          href="/admin/news/new"
          className="flex items-center gap-2 bg-[#d49f37] text-black px-4 py-2 rounded-lg font-medium hover:bg-[#b58529] transition-colors"
        >
          <Plus size={18} />
          Add Article
        </Link>
      </div>

      <div className="bg-[#121212] border border-white/5 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/5 border-b border-white/5 text-sm text-white/50">
              <tr>
                <th className="p-4 font-medium w-16">Image</th>
                <th className="p-4 font-medium">Title</th>
                <th className="p-4 font-medium">Tag</th>
                <th className="p-4 font-medium text-center">Featured</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {news.map((item) => (
                <tr key={item.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4">
                    <div className="relative w-12 h-12 rounded bg-black/50 overflow-hidden border border-white/10">
                      {item.image && (
                        <Image src={item.image} alt="" fill className="object-cover" />
                      )}
                    </div>
                  </td>
                  <td className="p-4 font-medium">{item.title}</td>
                  <td className="p-4 text-white/70">{item.tag}</td>
                  <td className="p-4 text-center">
                    {item.isFeatured ? (
                      <span className="inline-block px-2 py-1 bg-green-500/10 text-green-400 text-xs rounded-full">Yes</span>
                    ) : (
                      <span className="inline-block px-2 py-1 bg-white/5 text-white/40 text-xs rounded-full">No</span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/news/${item.id}`}
                        className="p-2 text-white/50 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                      >
                        <Edit size={16} />
                      </Link>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-white/50 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {news.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-white/40">
                    No news articles found. Add one to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
