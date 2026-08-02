"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageCircle, Phone, MapPin } from "lucide-react";
import { Logo } from "./Logo";

const InstagramIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

export function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;
  return (
    <footer id="contact" dir="ltr" className="bg-bg-elevated border-t border-border text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-24">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-16">
          
          {/* Brand & Story */}
          <div className="max-w-md">
            <Link href="/" className="inline-flex items-center gap-4 group mb-8">
              <Logo className="w-12 h-12 transition-transform group-hover:scale-105 theme-logo" />
            </Link>
            <p className="text-text-secondary text-sm leading-relaxed mb-8">
              Diar Selection brings you curated, world-class coffee equipment and accessories. Designed for enthusiasts and professionals who demand perfection in every brew.
            </p>
          </div>

          {/* Contact Details */}
          <div className="flex flex-col sm:flex-row gap-12 lg:gap-20">
            {/* Social & Contact */}
            <div className="space-y-6">
              <h4 className="text-text-primary text-xs font-semibold uppercase tracking-[0.2em] mb-6">
                CONNECT
              </h4>
              <a href="https://www.instagram.com/diar.selection?igsh=Zmh5OTc2ZGFxaDN3" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-text-secondary hover:text-gold transition-colors group">
                <div className="w-8 h-8 rounded-full bg-bg-card flex items-center justify-center group-hover:bg-gold/10 transition-colors">
                  <InstagramIcon />
                </div>
                <span className="text-sm">@diar.selection</span>
              </a>
              <a href="https://www.instagram.com/diar_anwar54?igsh=ZGU0dGswMnYyczk0" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-text-secondary hover:text-gold transition-colors group">
                <div className="w-8 h-8 rounded-full bg-bg-card flex items-center justify-center group-hover:bg-gold/10 transition-colors">
                  <InstagramIcon />
                </div>
                <span className="text-sm">@diar_anwar54</span>
              </a>
              <a href="https://wa.me/9647704503300" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-text-secondary hover:text-gold transition-colors group">
                <div className="w-8 h-8 rounded-full bg-bg-card flex items-center justify-center group-hover:bg-gold/10 transition-colors">
                  <MessageCircle size={16} />
                </div>
                <span className="text-sm">WhatsApp Chat</span>
              </a>
            </div>

            {/* Location & Support */}
            <div className="space-y-6">
              <h4 className="text-text-primary text-xs font-semibold uppercase tracking-[0.2em] mb-6">
                VISIT US
              </h4>
              <div className="flex items-start gap-4 text-text-secondary">
                <div className="w-8 h-8 rounded-full bg-bg-card flex items-center justify-center flex-shrink-0">
                  <MapPin size={16} />
                </div>
                <span className="text-sm leading-relaxed pt-1.5">
                  Slemani, Kurdistan Region<br />Iraq
                </span>
              </div>
              <div className="flex items-start gap-4 text-text-secondary mt-6">
                <div className="w-8 h-8 rounded-full bg-bg-card flex items-center justify-center flex-shrink-0">
                  <Phone size={16} />
                </div>
                <span className="text-sm pt-1.5">
                  +964 770 450 3300
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-text-muted text-[11px] uppercase tracking-wider text-center" dir="ltr">
            © {new Date().getFullYear()} Diar Selection. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
