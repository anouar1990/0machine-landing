"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Server, Send, UserX } from "lucide-react";

export default function SettingsLayout({ children }) {
  const pathname = usePathname();

  const tabs = [
    { href: "/email/settings/providers", label: "Providers", icon: Server },
    { href: "/email/settings/sending", label: "Sending Config", icon: Send },
    { href: "/email/settings/suppression", label: "Suppression", icon: UserX }
  ];

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto">
      {/* Settings Header */}
      <div className="border-b border-white/5 pb-6">
        <h1 className="text-3xl font-black text-white font-[Outfit]">Email System Settings</h1>
        <p className="text-sm text-gray-400 mt-1">
          Dynamic provider management, primary/fallback routing, rate limits, and suppression protection.
        </p>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex gap-2 border-b border-white/5 pb-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname === tab.href || (pathname === "/email/settings" && tab.href === "/email/settings/providers");
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                isActive
                  ? "bg-[#FE7733]/15 border-[#FE7733]/30 text-white shadow-sm"
                  : "border-transparent text-gray-400 hover:text-gray-200"
              }`}
            >
              <Icon size={14} className={isActive ? "text-[#FE7733]" : "text-gray-400"} />
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </div>

      <div>{children}</div>
    </div>
  );
}
