import { ShieldCheck, BadgeCheck, Lock, Headphones } from "lucide-react";

const badges = [
  {
    icon: ShieldCheck,
    title: "100% Original Products",
    description: "We guarantee authenticity in everything we sell.",
  },
  {
    icon: BadgeCheck,
    title: "Official Brands",
    description: "Authorized distributors from trusted sources.",
  },
  {
    icon: Lock,
    title: "Secure Shopping",
    description: "Safe data, secure transactions.",
  },
  {
    icon: Headphones,
    title: "Expert Support",
    description: "We are here before and after purchase.",
  },
];

export function TrustBadges() {
  return (
    <section className="relative z-10 -mt-1">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 bg-bg-elevated/80 backdrop-blur-sm border border-border rounded-2xl p-6 lg:p-8">
          {badges.map((badge, i) => {
            const Icon = badge.icon;
            return (
              <div
                key={i}
                className="flex flex-col items-center text-center gap-3 py-2"
              >
                <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center">
                  <Icon size={22} className="text-gold" />
                </div>
                <div>
                  <h3 className="text-text-primary text-xs sm:text-sm font-semibold mb-1">
                    {badge.title}
                  </h3>
                  <p className="text-text-muted text-[11px] sm:text-xs leading-relaxed">
                    {badge.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
