"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Search, X, ArrowRight } from "lucide-react";
import Link from "next/link";
import type { StoreProduct } from "@/lib/products";

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

export function SearchModal({ open, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<StoreProduct[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = "hidden";
    } else {
      setQuery("");
      setResults([]);
      document.body.style.overflow = "";
    }
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (!open) {
          // This would need a callback to open, handled by parent
        } else {
          onClose();
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  const handleSearch = useCallback(async (value: string) => {
    setQuery(value);
    if (value.trim().length >= 2) {
      try {
        const res = await fetch(`/api/products/search?q=${encodeURIComponent(value)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data);
        }
      } catch (err) {
        console.error("Search failed:", err);
      }
    } else {
      setResults([]);
    }
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center pt-20 sm:pt-32">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-bg-primary/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl mx-4 bg-bg-elevated border border-border rounded-2xl overflow-hidden shadow-2xl animate-fade-in">
        {/* Search Input */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
          <Search size={20} className="text-text-muted flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search products, categories..."
            className="flex-1 bg-transparent text-text-primary placeholder-text-muted outline-none text-base"
          />
          <button
            onClick={onClose}
            className="flex-shrink-0 text-text-muted hover:text-text-primary transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto">
          {query.length >= 2 && results.length === 0 && (
            <div className="px-5 py-12 text-center">
              <p className="text-text-muted text-sm">
                No products found for &quot;{query}&quot;
              </p>
            </div>
          )}

          {results.length > 0 && (
            <div className="py-2">
              <p className="px-5 py-2 text-xs text-text-muted uppercase tracking-wider">
                {results.length} product{results.length > 1 ? "s" : ""} found
              </p>
              {results.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  onClick={onClose}
                  className="flex items-center gap-4 px-5 py-3 hover:bg-bg-hover transition-colors group"
                >
                  <div className="w-12 h-12 rounded-lg bg-bg-card flex-shrink-0 overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-bg-card to-bg-elevated" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-text-primary text-sm font-medium truncate group-hover:text-gold transition-colors">
                      {product.name}
                    </p>
                    <p className="text-text-muted text-xs">
                      {product.brand} · {product.category}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-gold font-medium text-sm">
                      ${product.price.toFixed(2)}
                    </span>
                    <ArrowRight
                      size={14}
                      className="text-text-muted group-hover:text-gold transition-colors"
                    />
                  </div>
                </Link>
              ))}
            </div>
          )}

          {query.length < 2 && (
            <div className="px-5 py-8 text-center">
              <p className="text-text-muted text-sm">
                Start typing to search products...
              </p>
              <p className="text-text-muted/60 text-xs mt-1">
                Search by product name, brand, or category
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-border flex items-center justify-between">
          <span className="text-text-muted text-xs">
            Press <kbd className="px-1.5 py-0.5 bg-bg-card rounded text-[10px] font-mono">ESC</kbd> to close
          </span>
          {results.length > 0 && (
            <Link
              href="/products"
              onClick={onClose}
              className="text-gold text-xs hover:text-gold-light transition-colors"
            >
              View all products →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
