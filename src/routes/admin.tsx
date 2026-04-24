import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { BarChart3, Upload, BookOpen, Brain } from "lucide-react";
import { DashboardHeader } from "@/components/DashboardHeader";
import { AdminAnalytics } from "@/components/admin/AdminAnalytics";
import { AdminKnowledgeBase } from "@/components/admin/AdminKnowledgeBase";
import { AdminFileUpload } from "@/components/admin/AdminFileUpload";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — Smart Campus AI" },
      { name: "description", content: "Admin panel for Smart Campus AI Assistant" },
    ],
  }),
  component: AdminDashboard,
});

type AdminSection = "analytics" | "knowledge" | "upload";

const NAV_ITEMS = [
  { id: "analytics" as const, label: "Analytics", icon: BarChart3 },
  { id: "knowledge" as const, label: "Knowledge Base", icon: BookOpen },
  { id: "upload" as const, label: "File Upload", icon: Upload },
];

function AdminDashboard() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [section, setSection] = useState<AdminSection>("analytics");

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      navigate({ to: "/admin-login" });
    }
  }, [isAuthenticated, user, navigate]);

  if (!isAuthenticated || user?.role !== "admin") return null;

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="hidden w-64 flex-col border-r bg-sidebar md:flex">
        <div className="flex h-14 items-center gap-3 border-b border-sidebar-border px-6">
          <Brain className="h-6 w-6 text-sidebar-primary" />
          <span className="font-heading font-semibold text-sidebar-foreground">Admin Panel</span>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setSection(item.id)}
              className={`flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm transition-colors ${
                section === item.id
                  ? "bg-sidebar-accent text-sidebar-primary font-medium"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col">
        <DashboardHeader title="Admin Dashboard" />
        {/* Mobile nav */}
        <div className="flex gap-1 border-b p-2 md:hidden">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setSection(item.id)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                section === item.id ? "bg-primary/10 text-primary" : "text-muted-foreground"
              }`}
            >
              <item.icon className="h-3.5 w-3.5" />
              {item.label}
            </button>
          ))}
        </div>
        <main className="flex-1 overflow-y-auto p-6">
          {section === "analytics" && <AdminAnalytics />}
          {section === "knowledge" && <AdminKnowledgeBase />}
          {section === "upload" && <AdminFileUpload />}
        </main>
      </div>
    </div>
  );
}
