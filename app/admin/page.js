"use client";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ParticleField from "../components/ParticleField";
import { 
  Users, Mail, Database, Send, Plus, Trash2, FileText, 
  Settings, LogOut, CheckCircle2, AlertTriangle, Eye, RefreshCw, Layers, Edit, BarChart2
} from "lucide-react";

const ADMIN_EMAILS = ["admin@cooldelo.com", "anouarkharbache@gmail.com"];

export default function AdminDashboard() {
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  // State data
  const [stats, setStats] = useState({ dbSize: 0, tableSizes: {}, resend: { sent: 0, limit: 3000, remaining: 3000, is_mock: true } });
  const [usersList, setUsersList] = useState([]);
  const [messages, setMessages] = useState([]);
  const [designs, setDesigns] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [analyticsEvents, setAnalyticsEvents] = useState([]);
  
  // Form states
  const [loading, setLoading] = useState(false);
  const [designForm, setDesignForm] = useState({ title: "", category: "Christmas", tags: "", thumbnail_url: "", file_url: "", file_type: "zip" });
  const [blogForm, setBlogForm] = useState({ title: "", slug: "", excerpt: "", content: "", cover_image: "" });
  const [notification, setNotification] = useState({ text: "", type: "" });

  useEffect(() => {
    // Check initial auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setAuthLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session && isAdmin()) {
      fetchDashboardData();
    }
  }, [session, activeTab]);

  const isAdmin = () => {
    return session?.user?.email && ADMIN_EMAILS.includes(session.user.email);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError("");
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      if (data.session && !ADMIN_EMAILS.includes(data.session.user?.email)) {
        throw new Error("Unauthorized: You are not registered as an administrator.");
      }
    } catch (err) {
      setAuthError(err.message);
      supabase.auth.signOut();
    } finally {
      setAuthLoading(false);
    }
  };

  const showNotification = (text, type = "success") => {
    setNotification({ text, type });
    setTimeout(() => setNotification({ text: "", type: "" }), 4000);
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      if (activeTab === "overview") {
        // 1. Get database size stats
        const { data: dbData, error: dbErr } = await supabase.rpc("get_db_size");
        let dbSizeBytes = 0;
        let tableSizes = {};
        if (!dbErr && dbData && dbData.length > 0) {
          dbSizeBytes = dbData[0].db_size_bytes;
          tableSizes = dbData[0].table_sizes;
        }

        // 2. Get Resend email API limits
        const res = await fetch("/api/resend-limits");
        const resendData = await res.json();

        setStats(prev => ({
          ...prev,
          dbSize: dbSizeBytes,
          tableSizes: tableSizes,
          resend: resendData
        }));
      }

      if (activeTab === "subscriptions" || activeTab === "overview") {
        const { data, error } = await supabase
          .from("admin_user_subscriptions")
          .select("*")
          .order("updated_at", { ascending: false });
        if (!error && data) setUsersList(data);
      }

      if (activeTab === "messages" || activeTab === "overview") {
        const { data, error } = await supabase
          .from("contact_messages")
          .select("*")
          .order("created_at", { ascending: false });
        if (!error && data) setMessages(data);
      }

      if (activeTab === "designs") {
        const { data, error } = await supabase
          .from("designs")
          .select("*")
          .order("created_at", { ascending: false });
        if (!error && data) setDesigns(data);
      }

      if (activeTab === "blogs") {
        const { data, error } = await supabase
          .from("blogs")
          .select("*")
          .order("published_at", { ascending: false });
        if (!error && data) setBlogs(data);
      }

      if (activeTab === "analytics" || activeTab === "overview") {
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
        const { data: eventsData, error: eventsErr } = await supabase
          .from("analytics_events")
          .select("event_name, created_at, page_path, referrer, session_id, metadata")
          .gte("created_at", thirtyDaysAgo)
          .order("created_at", { ascending: false });
        if (!eventsErr && eventsData) setAnalyticsEvents(eventsData);
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Actions
  const handleMarkMessageRead = async (id, status) => {
    try {
      const { error } = await supabase
        .from("contact_messages")
        .update({ status })
        .eq("id", id);
      if (error) throw error;
      fetchDashboardData();
      showNotification(`Message marked as ${status}`);
    } catch (err) {
      showNotification(err.message, "error");
    }
  };

  const handleDeleteMessage = async (id) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    try {
      const { error } = await supabase
        .from("contact_messages")
        .delete()
        .eq("id", id);
      if (error) throw error;
      fetchDashboardData();
      showNotification("Message deleted successfully");
    } catch (err) {
      showNotification(err.message, "error");
    }
  };

  const handleAddDesign = async (e) => {
    e.preventDefault();
    if (!designForm.title || !designForm.file_url) {
      showNotification("Title and File URL are required", "error");
      return;
    }
    try {
      const tagsArray = designForm.tags ? designForm.tags.split(",").map(t => t.trim()) : [];
      const payload = {
        title: designForm.title,
        category: designForm.category,
        tags: tagsArray,
        thumbnail_url: designForm.thumbnail_url || null,
        file_url: designForm.file_url,
        file_type: designForm.file_type,
        downloads_count: 0
      };

      const { error } = await supabase
        .from("designs")
        .insert([payload]);

      if (error) throw error;

      showNotification("Design asset added to Library!");
      setDesignForm({ title: "", category: "Christmas", tags: "", thumbnail_url: "", file_url: "", file_type: "zip" });
      fetchDashboardData();
    } catch (err) {
      showNotification(err.message, "error");
    }
  };

  const handleDeleteDesign = async (id) => {
    if (!confirm("Are you sure you want to delete this design template?")) return;
    try {
      const { error } = await supabase
        .from("designs")
        .delete()
        .eq("id", id);
      if (error) throw error;
      fetchDashboardData();
      showNotification("Design deleted successfully");
    } catch (err) {
      showNotification(err.message, "error");
    }
  };

  const handleAddBlog = async (e) => {
    e.preventDefault();
    if (!blogForm.title || !blogForm.slug || !blogForm.content) {
      showNotification("Title, Slug, and Content are required", "error");
      return;
    }
    try {
      const payload = {
        title: blogForm.title,
        slug: blogForm.slug.toLowerCase().trim().replace(/\s+/g, "-"),
        excerpt: blogForm.excerpt || null,
        content: blogForm.content,
        cover_image: blogForm.cover_image || null,
        author: "0Machine Team"
      };

      const { error } = await supabase
        .from("blogs")
        .insert([payload]);

      if (error) throw error;

      showNotification("Blog post published successfully!");
      setBlogForm({ title: "", slug: "", excerpt: "", content: "", cover_image: "" });
      fetchDashboardData();
    } catch (err) {
      showNotification(err.message, "error");
    }
  };

  const handleDeleteBlog = async (id) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;
    try {
      const { error } = await supabase
        .from("blogs")
        .delete()
        .eq("id", id);
      if (error) throw error;
      fetchDashboardData();
      showNotification("Blog post deleted successfully");
    } catch (err) {
      showNotification(err.message, "error");
    }
  };

  const getStripePortalLink = (stripeCustId) => {
    if (!stripeCustId) return "#";
    // General direct customer dashboard search link or fallback portal
    return `https://dashboard.stripe.com/customers/${stripeCustId}`;
  };

  // Render Functions
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-950 text-white">
        <RefreshCw className="animate-spin text-accent-500 mr-3" size={24} />
        <span>Loading session...</span>
      </div>
    );
  }

  // Not Logged In or Not Admin Login Form
  if (!session || !isAdmin()) {
    return (
      <>
        <ParticleField />
        <Navbar />
        <main className="min-h-screen pt-32 pb-24 relative z-10 flex items-center justify-center px-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 w-full max-w-md backdrop-blur-xl">
            <div className="text-center mb-6">
              <span className="text-3xl">🛡️</span>
              <h1 className="text-2xl font-bold text-white font-[Outfit] mt-3">Admin Panel</h1>
              <p className="text-gray-400 text-xs mt-1">Authorized personnel only</p>
            </div>

            {authError && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-xs mb-4 flex items-center gap-2">
                <AlertTriangle size={14} />
                <span>{authError}</span>
              </div>
            )}

            {!session ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1 font-medium">Administrator Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-accent-500 transition-colors text-sm"
                    placeholder="admin@cooldelo.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1 font-medium">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-accent-500 transition-colors text-sm"
                    placeholder="••••••••"
                    required
                  />
                </div>
                <button type="submit" className="w-full glow-btn text-sm py-2.5 mt-2">
                  Authenticate Admin
                </button>
              </form>
            ) : (
              <div className="text-center space-y-4">
                <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 p-3 rounded-lg text-xs flex items-center gap-2">
                  <AlertTriangle size={14} />
                  <span>Access Denied: <strong>{session.user.email}</strong> is not listed as an administrator.</span>
                </div>
                <button 
                  onClick={() => supabase.auth.signOut()} 
                  className="w-full bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl py-2.5 text-white text-sm font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <LogOut size={16} />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Admin Dashboard Content
  const unreadMessagesCount = messages.filter(m => m.status === 'unread').length;
  const activeSubsCount = usersList.filter(u => u.subscription_status === 'active' || u.subscription_status === 'trialing').length;

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-28 pb-24 relative bg-dark-950 text-gray-300">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white font-[Outfit] flex items-center gap-2">
                <span>🛡️</span> Admin Console
              </h1>
              <p className="text-gray-400 text-xs mt-1">
                Signed in as <span className="text-accent-400 font-semibold">{session.user.email}</span>
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={fetchDashboardData}
                className="p-2 border border-white/10 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
                title="Refresh Data"
              >
                <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
              </button>
              
              <button 
                onClick={() => supabase.auth.signOut()} 
                className="bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-xl text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <LogOut size={14} />
                <span>Log Out</span>
              </button>
            </div>
          </div>

          {/* Notifications Alert */}
          {notification.text && (
            <div className={`fixed bottom-6 right-6 z-50 p-4 rounded-xl shadow-lg border backdrop-blur-md flex items-center gap-2 text-sm transition-all duration-300 ${
              notification.type === "error" 
                ? "bg-red-500/20 border-red-500/30 text-red-400" 
                : "bg-green-500/20 border-green-500/30 text-green-400"
            }`}>
              <CheckCircle2 size={16} />
              <span>{notification.text}</span>
            </div>
          )}

          {/* Tab Selection */}
          <div className="flex gap-2 overflow-x-auto border-b border-white/5 pb-2 mb-8 scrollbar-thin">
            {[
              { id: "overview", label: "Overview", icon: Layers },
              { id: "subscriptions", label: `Subscriptions (${activeSubsCount})`, icon: Users },
              { id: "messages", label: `Inquiries (${unreadMessagesCount})`, icon: Mail },
              { id: "analytics", label: "Live Analytics", icon: BarChart2 },
              { id: "designs", label: "Design Library", icon: Settings },
              { id: "blogs", label: "SEO Blogs", icon: FileText },
            ].map(t => {
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all whitespace-nowrap ${
                    activeTab === t.id 
                      ? "bg-accent-500/10 border-accent-500/20 text-white" 
                      : "border-transparent text-gray-500 hover:text-gray-300 hover:bg-white/[0.02]"
                  }`}
                >
                  <Icon size={14} />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB CONTENTS */}
          
          {/* 1. OVERVIEW TAB */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* Card 1: Subscriptions */}
                <div className="bg-white/5 border border-white/5 rounded-2xl p-6">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Active Subs</span>
                    <span className="p-1.5 bg-accent-500/10 rounded-lg text-accent-400"><Users size={16} /></span>
                  </div>
                  <h3 className="text-3xl font-bold text-white font-[Outfit]">{activeSubsCount}</h3>
                  <p className="text-[10px] text-gray-500 mt-2">Total registered: {usersList.length}</p>
                </div>

                {/* Card 2: Inquiries */}
                <div className="bg-white/5 border border-white/5 rounded-2xl p-6">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Support Inbox</span>
                    <span className="p-1.5 bg-blue-500/10 rounded-lg text-blue-400"><Mail size={16} /></span>
                  </div>
                  <h3 className="text-3xl font-bold text-white font-[Outfit]">{messages.length}</h3>
                  <p className="text-[10px] text-yellow-400 mt-2">{unreadMessagesCount} unread emails pending</p>
                </div>

                {/* Card 3: Supabase Storage */}
                <div className="bg-white/5 border border-white/5 rounded-2xl p-6">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Supabase Size</span>
                    <span className="p-1.5 bg-green-500/10 rounded-lg text-green-400"><Database size={16} /></span>
                  </div>
                  <h3 className="text-2xl font-bold text-white font-[Outfit]">
                    {(stats.dbSize / (1024 * 1024)).toFixed(2)} MB
                  </h3>
                  <div className="w-full bg-white/5 h-1.5 rounded-full mt-3 overflow-hidden">
                    <div 
                      className="bg-green-500 h-full rounded-full" 
                      style={{ width: `${Math.min(100, (stats.dbSize / (500 * 1024 * 1024)) * 100)}%` }}
                    />
                  </div>
                  <p className="text-[9px] text-gray-500 mt-1.5">
                    Limit: 500 MB (Free tier)
                  </p>
                </div>

                {/* Card 4: Resend API */}
                <div className="bg-white/5 border border-white/5 rounded-2xl p-6">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Resend API</span>
                    <span className="p-1.5 bg-purple-500/10 rounded-lg text-purple-400"><Send size={16} /></span>
                  </div>
                  <h3 className="text-2xl font-bold text-white font-[Outfit]">
                    {stats.resend.sent} / {stats.resend.limit}
                  </h3>
                  <div className="w-full bg-white/5 h-1.5 rounded-full mt-3 overflow-hidden">
                    <div 
                      className="bg-purple-500 h-full rounded-full" 
                      style={{ width: `${(stats.resend.sent / stats.resend.limit) * 100}%` }}
                    />
                  </div>
                  <p className="text-[9px] text-gray-500 mt-1.5">
                    {stats.resend.is_mock ? "⚠️ Using simulated values" : "API Connected Live"}
                  </p>
                </div>
              </div>

              {/* Database Table Breakdown */}
              <div className="bg-white/5 border border-white/5 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white font-[Outfit] mb-4">PostgreSQL Table Storage Breakdown</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    {Object.entries(stats.tableSizes || {}).slice(0, 5).map(([tbl, bytes]) => (
                      <div key={tbl} className="flex justify-between items-center bg-white/[0.01] border border-white/5 p-3 rounded-xl">
                        <span className="text-xs font-medium text-white">{tbl}</span>
                        <span className="text-xs text-gray-500">{(bytes / 1024).toFixed(1)} KB</span>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-3">
                    {Object.entries(stats.tableSizes || {}).slice(5, 10).map(([tbl, bytes]) => (
                      <div key={tbl} className="flex justify-between items-center bg-white/[0.01] border border-white/5 p-3 rounded-xl">
                        <span className="text-xs font-medium text-white">{tbl}</span>
                        <span className="text-xs text-gray-500">{(bytes / 1024).toFixed(1)} KB</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. SUBSCRIPTIONS TAB */}
          {activeTab === "subscriptions" && (
            <div className="bg-white/5 border border-white/5 rounded-2xl p-6 overflow-hidden">
              <h3 className="text-lg font-bold text-white font-[Outfit] mb-4">User Subscriptions Dashboard</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-white/10 text-gray-500 uppercase tracking-wider font-semibold">
                      <th className="py-3 px-4">User Email</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Price ID / Tier</th>
                      <th className="py-3 px-4">Stripe ID</th>
                      <th className="py-3 px-4">Last Update</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersList.map((user) => (
                      <tr key={user.user_id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                        <td className="py-3.5 px-4 font-medium text-white">{user.email || "No Email"}</td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            user.subscription_status === 'active' || user.subscription_status === 'trialing'
                              ? "bg-green-500/10 text-green-400" 
                              : "bg-red-500/10 text-red-400"
                          }`}>
                            {user.subscription_status?.toUpperCase() || "INACTIVE"}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-gray-400 font-mono">
                          {user.subscription_price_id === 'price_1TuaQPGNkz6GTxuMEEjO6kny' ? "Pro Workshop ($19)" :
                           user.subscription_price_id === 'price_1TuaQVGNkz6GTxuMi59lGKB5' ? "Industrial ($69)" :
                           user.subscription_price_id === 'price_1TAtn4GNkz6GTxuMwTn9DjU3' ? "Hobbyist ($9)" :
                           "Free/Standard"}
                        </td>
                        <td className="py-3.5 px-4 text-gray-500 font-mono">{user.stripe_customer_id || "None"}</td>
                        <td className="py-3.5 px-4 text-gray-500">{new Date(user.updated_at).toLocaleDateString()}</td>
                        <td className="py-3.5 px-4 text-right">
                          {user.stripe_customer_id ? (
                            <a 
                              href={getStripePortalLink(user.stripe_customer_id)} 
                              target="_blank" 
                              rel="noreferrer"
                              className="text-accent-400 hover:underline inline-flex items-center gap-1 font-semibold"
                            >
                              <span>View Stripe</span>
                            </a>
                          ) : (
                            <span className="text-gray-600">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                    {usersList.length === 0 && (
                      <tr>
                        <td colSpan="6" className="py-8 text-center text-gray-500">No active subscribers found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 3. SUPPORT MESSAGES TAB */}
          {activeTab === "messages" && (
            <div className="space-y-6">
              <div className="bg-white/5 border border-white/5 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white font-[Outfit] mb-4">Support & Request Inquiries</h3>
                
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div 
                      key={msg.id} 
                      className={`border p-5 rounded-2xl backdrop-blur-xl transition-all ${
                        msg.status === 'unread' 
                          ? "bg-accent-500/[0.02] border-accent-500/20" 
                          : "bg-white/[0.01] border-white/5 opacity-75"
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                        <div>
                          <span className="text-xs text-gray-500">{new Date(msg.created_at).toLocaleString()}</span>
                          <h4 className="text-sm font-bold text-white mt-0.5">{msg.name} ({msg.email})</h4>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleMarkMessageRead(msg.id, msg.status === 'unread' ? 'read' : 'unread')}
                            className="bg-white/5 hover:bg-white/10 px-3 py-1 rounded-lg text-[10px] font-semibold text-white border border-white/10 transition-colors"
                          >
                            Mark as {msg.status === 'unread' ? 'Read' : 'Unread'}
                          </button>
                          <button
                            onClick={() => handleDeleteMessage(msg.id)}
                            className="bg-red-500/10 hover:bg-red-500/20 px-3 py-1 rounded-lg text-[10px] font-semibold text-red-400 border border-red-500/10 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-gray-300 leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                    </div>
                  ))}
                  {messages.length === 0 && (
                    <div className="py-12 text-center text-gray-500">Your support inbox is empty.</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 4. DESIGN LIBRARY TAB */}
          {activeTab === "designs" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Form Col */}
              <div className="bg-white/5 border border-white/5 rounded-2xl p-6 h-fit">
                <h3 className="text-lg font-bold text-white font-[Outfit] mb-4">Add Vector Asset</h3>
                <form onSubmit={handleAddDesign} className="space-y-4">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Asset Title</label>
                    <input
                      type="text"
                      value={designForm.title}
                      onChange={(e) => setDesignForm({...designForm, title: e.target.value})}
                      placeholder="e.g. Christmas Reindeer Stand"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-accent-500 text-xs"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Category</label>
                      <input
                        type="text"
                        value={designForm.category}
                        onChange={(e) => setDesignForm({...designForm, category: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-accent-500 text-xs"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">File Type</label>
                      <select
                        value={designForm.file_type}
                        onChange={(e) => setDesignForm({...designForm, file_type: e.target.value})}
                        className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-accent-500 text-xs"
                      >
                        <option value="zip">ZIP Bundle</option>
                        <option value="dxf">DXF Vector</option>
                        <option value="svg">SVG Vector</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Google Drive File Link</label>
                    <input
                      type="url"
                      value={designForm.file_url}
                      onChange={(e) => setDesignForm({...designForm, file_url: e.target.value})}
                      placeholder="https://drive.google.com/..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-accent-500 text-xs"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Thumbnail Image URL</label>
                    <input
                      type="url"
                      value={designForm.thumbnail_url}
                      onChange={(e) => setDesignForm({...designForm, thumbnail_url: e.target.value})}
                      placeholder="https://image-hosting.com/..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-accent-500 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Tags (comma-separated)</label>
                    <input
                      type="text"
                      value={designForm.tags}
                      onChange={(e) => setDesignForm({...designForm, tags: e.target.value})}
                      placeholder="decor, wood, christmas"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-accent-500 text-xs"
                    />
                  </div>

                  <button type="submit" className="w-full glow-btn text-xs py-2.5 flex items-center justify-center gap-1">
                    <Plus size={14} />
                    <span>Upload Vector Asset</span>
                  </button>
                </form>
              </div>

              {/* List Col */}
              <div className="bg-white/5 border border-white/5 rounded-2xl p-6 lg:col-span-2 overflow-hidden">
                <h3 className="text-lg font-bold text-white font-[Outfit] mb-4">Designs Library List</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-white/10 text-gray-500 uppercase tracking-wider font-semibold">
                        <th className="py-3 px-4">Thumbnail</th>
                        <th className="py-3 px-4">Title</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4 text-center">Downloads</th>
                        <th className="py-3 px-4 text-right">Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      {designs.map((d) => (
                        <tr key={d.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                          <td className="py-2.5 px-4">
                            {d.thumbnail_url ? (
                              <img src={d.thumbnail_url} alt="" className="w-10 h-10 object-cover rounded-lg border border-white/10" />
                            ) : (
                              <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center text-xs">📁</div>
                            )}
                          </td>
                          <td className="py-2.5 px-4 font-semibold text-white">
                            <a href={d.file_url} target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-1">
                              <span>{d.title}</span>
                            </a>
                          </td>
                          <td className="py-2.5 px-4 text-gray-400">{d.category}</td>
                          <td className="py-2.5 px-4 text-center text-gray-500 font-mono">{d.downloads_count || 0}</td>
                          <td className="py-2.5 px-4 text-right">
                            <button
                              onClick={() => handleDeleteDesign(d.id)}
                              className="text-red-400 hover:text-red-500 p-1 rounded-lg border border-red-500/10 hover:bg-red-500/5 transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {designs.length === 0 && (
                        <tr>
                          <td colSpan="5" className="py-8 text-center text-gray-500">No designs uploaded yet.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* 5. BLOG CMS TAB */}
          {activeTab === "blogs" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Write Form */}
              <div className="bg-white/5 border border-white/5 rounded-2xl p-6 h-fit lg:col-span-1">
                <h3 className="text-lg font-bold text-white font-[Outfit] mb-4">Write Blog Post</h3>
                <form onSubmit={handleAddBlog} className="space-y-4">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Post Title</label>
                    <input
                      type="text"
                      value={blogForm.title}
                      onChange={(e) => {
                        const title = e.target.value;
                        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
                        setBlogForm({...blogForm, title, slug});
                      }}
                      placeholder="How to quote laser cut jobs"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-accent-500 text-xs"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-400 mb-1">SEO URL Slug</label>
                    <input
                      type="text"
                      value={blogForm.slug}
                      onChange={(e) => setBlogForm({...blogForm, slug: e.target.value})}
                      placeholder="how-to-quote-laser-cut-jobs"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-accent-500 text-xs"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Cover Image Link (URL)</label>
                    <input
                      type="url"
                      value={blogForm.cover_image}
                      onChange={(e) => setBlogForm({...blogForm, cover_image: e.target.value})}
                      placeholder="https://image-hosting.com/blog-cover.jpg"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-accent-500 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Meta Description / Excerpt</label>
                    <textarea
                      rows="2"
                      value={blogForm.excerpt}
                      onChange={(e) => setBlogForm({...blogForm, excerpt: e.target.value})}
                      placeholder="A short summary of the article for search results..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-accent-500 text-xs resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Article Content (HTML or Markdown)</label>
                    <textarea
                      rows="8"
                      value={blogForm.content}
                      onChange={(e) => setBlogForm({...blogForm, content: e.target.value})}
                      placeholder="Write your article here..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-accent-500 text-xs font-mono"
                      required
                    />
                  </div>

                  <button type="submit" className="w-full glow-btn text-xs py-2.5 flex items-center justify-center gap-1">
                    <Plus size={14} />
                    <span>Publish Post</span>
                  </button>
                </form>
              </div>

              {/* Published Posts */}
              <div className="bg-white/5 border border-white/5 rounded-2xl p-6 lg:col-span-2 overflow-hidden">
                <h3 className="text-lg font-bold text-white font-[Outfit] mb-4">Published Blog Posts</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-white/10 text-gray-500 uppercase tracking-wider font-semibold">
                        <th className="py-3 px-4">Title</th>
                        <th className="py-3 px-4">Slug</th>
                        <th className="py-3 px-4">Published Date</th>
                        <th className="py-3 px-4 text-right">Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      {blogs.map((b) => (
                        <tr key={b.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                          <td className="py-3 px-4 font-semibold text-white">{b.title}</td>
                          <td className="py-3 px-4 text-accent-400 font-mono">/blog/{b.slug}</td>
                          <td className="py-3 px-4 text-gray-500">{new Date(b.published_at).toLocaleDateString()}</td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => handleDeleteBlog(b.id)}
                              className="text-red-400 hover:text-red-500 p-1 rounded-lg border border-red-500/10 hover:bg-red-500/5 transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {blogs.length === 0 && (
                        <tr>
                          <td colSpan="4" className="py-8 text-center text-gray-500">No blog posts published yet.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* 6. ANALYTICS TAB */}
          {activeTab === "analytics" && (() => {
            const fiveMinsAgo = new Date(Date.now() - 5 * 60 * 1000);
            
            // Calculate metrics
            const liveSessions = new Set(
              analyticsEvents
                .filter(e => new Date(e.created_at) >= fiveMinsAgo)
                .map(e => e.session_id)
            ).size;

            const totalViews = analyticsEvents.filter(e => e.event_name === 'pageview').length;
            const uniqueVisitors = new Set(analyticsEvents.map(e => e.session_id)).size;
            
            const trialClicks = analyticsEvents.filter(e => 
              e.event_name === 'cta_click' || 
              (e.event_name === 'pageview' && e.page_path === '/dashboard?subscription=success')
            ).length;

            const conversionRate = uniqueVisitors > 0 ? ((trialClicks / uniqueVisitors) * 100).toFixed(1) : 0;

            // Group by pages
            const pageCounts = {};
            analyticsEvents
              .filter(e => e.event_name === 'pageview')
              .forEach(e => {
                const path = e.page_path || '/';
                pageCounts[path] = (pageCounts[path] || 0) + 1;
              });
            const topPages = Object.entries(pageCounts)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 7);

            // Group by referrers
            const referrerCounts = {};
            analyticsEvents.forEach(e => {
              let ref = e.referrer || 'direct';
              if (ref.includes('://')) {
                ref = ref.split('://')[1].split('/')[0];
              }
              if (ref.startsWith('www.')) {
                ref = ref.substring(4);
              }
              referrerCounts[ref] = (referrerCounts[ref] || 0) + 1;
            });
            const topReferrers = Object.entries(referrerCounts)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 7);

            // Funnel items
            const ctaDetails = {};
            analyticsEvents
              .filter(e => e.event_name === 'cta_click')
              .forEach(e => {
                const btn = e.metadata?.button || 'unknown';
                ctaDetails[btn] = (ctaDetails[btn] || 0) + 1;
              });

            return (
              <div className="space-y-8">
                {/* Stats row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white/5 border border-white/5 rounded-2xl p-6 relative overflow-hidden">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Live Active Users</span>
                      <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-ping mt-1.5" />
                    </div>
                    <h3 className="text-3xl font-bold text-white font-[Outfit]">{liveSessions}</h3>
                    <p className="text-[10px] text-green-400 mt-2">Active sessions (last 5 mins)</p>
                  </div>

                  <div className="bg-white/5 border border-white/5 rounded-2xl p-6">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Pageviews (30d)</span>
                      <span className="p-1.5 bg-accent-500/10 rounded-lg text-accent-400"><BarChart2 size={16} /></span>
                    </div>
                    <h3 className="text-3xl font-bold text-white font-[Outfit]">{totalViews}</h3>
                    <p className="text-[10px] text-gray-500 mt-2">Total tracked page loads</p>
                  </div>

                  <div className="bg-white/5 border border-white/5 rounded-2xl p-6">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Unique Visitors</span>
                      <span className="p-1.5 bg-purple-500/10 rounded-lg text-purple-400"><Users size={16} /></span>
                    </div>
                    <h3 className="text-3xl font-bold text-white font-[Outfit]">{uniqueVisitors}</h3>
                    <p className="text-[10px] text-gray-500 mt-2">Unique anonymous device IDs</p>
                  </div>

                  <div className="bg-white/5 border border-white/5 rounded-2xl p-6">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">CTA Conversion Rate</span>
                      <span className="p-1.5 bg-blue-500/10 rounded-lg text-blue-400"><Eye size={16} /></span>
                    </div>
                    <h3 className="text-3xl font-bold text-white font-[Outfit]">{conversionRate}%</h3>
                    <p className="text-[10px] text-gray-500 mt-2">Unique clicks on trials / visits</p>
                  </div>
                </div>

                {/* Double column Page/Referrer tables */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Top Pages */}
                  <div className="bg-white/5 border border-white/5 rounded-2xl p-6 overflow-hidden">
                    <h3 className="text-base font-bold text-white font-[Outfit] mb-4">Top Visited Pages</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="border-b border-white/10 text-gray-500 uppercase tracking-wider font-semibold">
                            <th className="py-2.5 px-4">Page Path</th>
                            <th className="py-2.5 px-4 text-right">Views</th>
                          </tr>
                        </thead>
                        <tbody>
                          {topPages.map(([path, count]) => (
                            <tr key={path} className="border-b border-white/5 hover:bg-white/[0.02]">
                              <td className="py-3 px-4 font-mono text-gray-300">{path}</td>
                              <td className="py-3 px-4 text-right text-white font-bold">{count}</td>
                            </tr>
                          ))}
                          {topPages.length === 0 && (
                            <tr>
                              <td colSpan="2" className="py-6 text-center text-gray-500">No page views recorded yet.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Top Referrers */}
                  <div className="bg-white/5 border border-white/5 rounded-2xl p-6 overflow-hidden">
                    <h3 className="text-base font-bold text-white font-[Outfit] mb-4">Top Traffic Referrers</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="border-b border-white/10 text-gray-500 uppercase tracking-wider font-semibold">
                            <th className="py-2.5 px-4">Referrer Source</th>
                            <th className="py-2.5 px-4 text-right">Visits</th>
                          </tr>
                        </thead>
                        <tbody>
                          {topReferrers.map(([ref, count]) => (
                            <tr key={ref} className="border-b border-white/5 hover:bg-white/[0.02]">
                              <td className="py-3 px-4 font-semibold text-gray-300">
                                {ref === 'direct' ? '📥 Direct Traffic' : ref}
                              </td>
                              <td className="py-3 px-4 text-right text-white font-bold">{count}</td>
                            </tr>
                          ))}
                          {topReferrers.length === 0 && (
                            <tr>
                              <td colSpan="2" className="py-6 text-center text-gray-500">No referrer data recorded yet.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Funnel Click Analysis */}
                <div className="bg-white/5 border border-white/5 rounded-2xl p-6 overflow-hidden">
                  <h3 className="text-base font-bold text-white font-[Outfit] mb-4">CTA Button Click Breakdown</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-white/10 text-gray-500 uppercase tracking-wider font-semibold">
                          <th className="py-2.5 px-4">Button Identifier (CTA Target)</th>
                          <th className="py-2.5 px-4 text-right">Click Count</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(ctaDetails).map(([btn, count]) => (
                          <tr key={btn} className="border-b border-white/5 hover:bg-white/[0.02]">
                            <td className="py-3 px-4 font-mono text-gray-300">{btn}</td>
                            <td className="py-3 px-4 text-right text-white font-bold">{count}</td>
                          </tr>
                        ))}
                        {Object.keys(ctaDetails).length === 0 && (
                          <tr>
                            <td colSpan="2" className="py-6 text-center text-gray-500">No button clicks tracked yet.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            );
          })()}

        </div>
      </main>
      <Footer />
    </>
  );
}
