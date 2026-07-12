"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  Package,
  Grid3X3,
  Tag,
  LogOut,
  LayoutDashboard,
  ChevronRight,
  Menu,
  X,
  Coffee,
} from "lucide-react";

const sidebarLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: Grid3X3 },
  { href: "/admin/brewing-methods", label: "Brewing Methods", icon: Coffee },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Skip auth check for login page
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) {
      setAuthenticated(true); // Don't redirect from login page
      return;
    }

    fetch("/api/admin/me")
      .then((res) => res.json())
      .then((data) => {
        if (!data.authenticated) {
          router.push("/admin/login");
        } else {
          setAuthenticated(true);
        }
      })
      .catch(() => router.push("/admin/login"));
  }, [isLoginPage, router]);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  };

  // Show login page without layout
  if (isLoginPage) return <>{children}</>;

  // Loading state
  if (authenticated === null) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#d49f37] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white flex">
      {/* Sidebar Overlay (mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#0a0a0a] border-r border-white/5 flex flex-col transition-transform lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand */}
        <div className="p-6 border-b border-white/5">
          <Link href="/admin" className="block">
            <h2 className="font-serif text-xl tracking-[0.2em] text-white">
              DIAR
            </h2>
            <p className="text-[9px] tracking-[0.3em] text-white/30 uppercase">
              Admin Panel
            </p>
          </Link>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 p-4 space-y-1">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-[#d49f37]/15 text-[#d49f37]"
                    : "text-white/50 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon size={18} />
                <span>{link.label}</span>
                {isActive && (
                  <ChevronRight size={14} className="ml-auto opacity-50" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-white/40 hover:text-red-400 hover:bg-red-400/5 transition-colors w-full"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="h-16 border-b border-white/5 flex items-center px-6 bg-[#0a0a0a]/50 backdrop-blur-sm sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 -ml-2 text-white/50 hover:text-white"
          >
            <Menu size={20} />
          </button>
          <div className="ml-auto flex items-center gap-4">
            <Link
              href="/"
              target="_blank"
              className="text-[11px] uppercase tracking-widest text-white/30 hover:text-[#d49f37] transition-colors"
            >
              View Site →
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
