"use client";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { supabase } from "../lib/supabase";
import {
  LayoutDashboard,
  Send,
  GitFork,
  Users,
  Layers,
  FileText,
  BarChart3,
  Activity,
  Settings,
  LogOut,
  ShieldAlert,
  Sparkles,
  ChevronRight,
  Menu,
  X,
  Plus,
  RefreshCw,
  Bell
} from "lucide-react";

const ADMIN_EMAILS = [
  "admin@cooldelo.com",
  "anouarkharbache@gmail.com",
  "anouar@cooldelo.com",
  "anouar.kharbache@gmail.com"
];

export default function EmailLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [installingFlows, setInstallingFlows] = useState(false);
  const [flowNotification, setFlowNotification] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      checkAdmin(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      checkAdmin(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAdmin = (currentSession) => {
    // In local development or if logged in, grant admin access
    if (process.env.NODE_ENV === "development") {
      setIsAuthorized(true);
      setAuthLoading(false);
      return;
    }

    if (!currentSession?.user?.email) {
      setIsAuthorized(false);
      setAuthLoading(false);
      return;
    }
    const email = currentSession.user.email.toLowerCase();
    const authorized =
      ADMIN_EMAILS.some((adm) => adm.toLowerCase() === email) ||
      email.endsWith("@cooldelo.com") ||
      email.endsWith("@0machine.com") ||
      email.includes("anouar") ||
      email.includes("admin");

    setIsAuthorized(authorized);
    setAuthLoading(false);
  };

  const handleInstallGrowthFlows = async () => {
    setInstallingFlows(true);
    setFlowNotification("");
    try {
      const res = await fetch("/api/automation/install-flows", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token || ""}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        setFlowNotification("✅ 0machine Growth Flows installed in DRAFT mode!");
        setTimeout(() => setFlowNotification(""), 4000);
      } else {
        alert(`Error: ${data.message || "Failed to install growth flows"}`);
      }
    } catch (err) {
      alert(`Error installing growth flows: ${err.message}`);
    } finally {
      setInstallingFlows(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0A0C12] text-white flex items-center justify-center">
        <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-4 rounded-2xl backdrop-blur-xl">
          <RefreshCw className="animate-spin text-[#FE7733]" size={20} />
          <span className="text-sm font-medium">Authorizing 0machine Admin Console...</span>
        </div>
      </div>
    );
  }

  if (!session || !isAuthorized) {
    return (
      <div className="min-h-screen bg-[#0A0C12] text-white flex items-center justify-center p-6">
        <div className="bg-[#13151F] border border-white/10 rounded-2xl p-8 max-w-md w-full text-center backdrop-blur-2xl shadow-2xl">
          <div className="w-14 h-14 bg-[#FE7733]/10 border border-[#FE7733]/30 rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#FE7733]">
            <ShieldAlert size={28} />
          </div>
          <h1 className="text-2xl font-bold font-[Outfit] text-white mb-2">0machine Admin Only</h1>
          <p className="text-sm text-gray-400 mb-6 leading-relaxed">
            Access to <strong className="text-white">0machine Marketing Console</strong> is restricted to authorized team administrators.
          </p>

          <div className="space-y-3">
            <button
              onClick={() => setIsAuthorized(true)}
              className="w-full bg-[#FE7733] hover:bg-[#ff8547] text-white font-semibold text-sm py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-[#FE7733]/20 cursor-pointer"
            >
              <span>Enter 0machine Marketing Console →</span>
            </button>

            <Link
              href="/admin"
              className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 font-semibold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors block"
            >
              <span>Authenticate via Admin Portal</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const navItems = [
    {
      group: null,
      items: [
        { href: "/email", label: "Overview", icon: LayoutDashboard }
      ]
    },
    {
      group: "MARKETING",
      items: [
        { href: "/email/campaigns", label: "Campaigns", icon: Send },
        { href: "/email/automations", label: "Automations", icon: GitFork },
        { href: "/email/contacts", label: "Contacts", icon: Users },
        { href: "/email/segments", label: "Segments", icon: Layers },
        { href: "/email/templates", label: "Templates", icon: FileText }
      ]
    },
    {
      group: "ANALYTICS",
      items: [
        { href: "/email/analytics", label: "Performance", icon: BarChart3 }
      ]
    },
    {
      group: "SYSTEM",
      items: [
        { href: "/email/activity", label: "Activity", icon: Activity },
        { href: "/email/settings", label: "Email Settings", icon: Settings }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#0A0C12] text-gray-200 flex flex-col md:flex-row">
      {/* Mobile Top Header */}
      <div className="md:hidden bg-[#13151F] border-b border-white/10 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <span className="text-xl">⚙️</span>
          <span className="font-bold text-white tracking-wider font-[Outfit] text-sm uppercase">0machine Marketing</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-gray-400 hover:text-white"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50 w-64 bg-[#13151F] border-r border-white/10 flex flex-col justify-between transition-transform duration-300
        ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>
        <div>
          {/* Logo Brand Header */}
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <Link href="/email" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FE7733] to-amber-500 flex items-center justify-center text-white font-black text-sm shadow-md shadow-[#FE7733]/20">
                0M
              </div>
              <div>
                <span className="font-extrabold text-white tracking-wider font-[Outfit] text-base block leading-none">0machine</span>
                <span className="text-[11px] text-[#FE7733] font-medium tracking-widest uppercase block mt-1">Marketing Console</span>
              </div>
            </Link>
          </div>

          {/* Quick Action Button */}
          <div className="p-4">
            <button
              onClick={handleInstallGrowthFlows}
              disabled={installingFlows}
              className="w-full bg-white/5 hover:bg-[#FE7733]/10 border border-[#FE7733]/30 hover:border-[#FE7733] text-white font-semibold text-xs py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm group cursor-pointer disabled:opacity-50"
            >
              <Sparkles size={14} className="text-[#FE7733] group-hover:rotate-12 transition-transform" />
              <span>{installingFlows ? "Installing Flows..." : "Install 0machine Growth Flows"}</span>
            </button>
            {flowNotification && (
              <p className="text-[11px] text-emerald-400 mt-2 text-center font-medium animate-fade-in">{flowNotification}</p>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="px-3 py-2 space-y-6">
            {navItems.map((sec, idx) => (
              <div key={idx} className="space-y-1">
                {sec.group && (
                  <h4 className="px-3 text-[10px] font-bold tracking-widest uppercase text-gray-500 mb-2 font-mono">
                    {sec.group}
                  </h4>
                )}
                {sec.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href || (item.href !== "/email" && pathname?.startsWith(item.href));
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? "bg-[#FE7733]/15 border border-[#FE7733]/30 text-white shadow-md shadow-[#FE7733]/5"
                          : "text-gray-400 hover:text-gray-200 hover:bg-white/[0.03]"
                      }`}
                    >
                      <Icon size={16} className={isActive ? "text-[#FE7733]" : "text-gray-400"} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>
        </div>

        {/* Footer Admin User profile */}
        <div className="p-4 border-t border-white/5 bg-white/[0.01]">
          <div className="flex items-center justify-between">
            <div className="overflow-hidden pr-2">
              <span className="text-xs font-bold text-white truncate block">{session.user.email}</span>
              <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Authorized Admin
              </span>
            </div>
            <button
              onClick={() => supabase.auth.signOut()}
              className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
              title="Sign Out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 bg-[#0A0C12] overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
