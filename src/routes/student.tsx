import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { LayoutDashboard, Brain, TrendingUp, GitBranch } from "lucide-react";
import { DashboardHeader } from "@/components/DashboardHeader";
import { StudentWelcome } from "@/components/student/StudentWelcome";
import { AcademicAssistant } from "@/components/student/AcademicAssistant";
import { EamcetPredictor } from "@/components/student/EamcetPredictor";
import { BranchRecommender } from "@/components/student/BranchRecommender";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/student")({
  head: () => ({
    meta: [
      { title: "Student Dashboard — Smart Campus AI" },
      { name: "description", content: "Student dashboard for Smart Campus AI Assistant" },
    ],
  }),
  component: StudentDashboard,
});

type StudentSection = "dashboard" | "assistant" | "predictor" | "recommender";

const NAV_ITEMS = [
  { id: "dashboard" as const, label: "Dashboard", icon: LayoutDashboard },
  { id: "assistant" as const, label: "Academic Assistant", icon: Brain },
  { id: "predictor" as const, label: "EAMCET Predictor", icon: TrendingUp },
  { id: "recommender" as const, label: "Branch Recommender", icon: GitBranch },
];

function StudentDashboard() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [section, setSection] = useState<StudentSection>("dashboard");

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "student") {
      navigate({ to: "/student-login" });
    }
  }, [isAuthenticated, user, navigate]);

  if (!isAuthenticated || user?.role !== "student") return null;

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="hidden w-64 flex-col border-r bg-sidebar md:flex">
        <div className="flex h-14 items-center gap-3 border-b border-sidebar-border px-6">
          <Brain className="h-6 w-6 text-sidebar-primary" />
          <span className="font-heading font-semibold text-sidebar-foreground">Student Portal</span>
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
        <DashboardHeader title="Student Dashboard" />
        {/* Mobile nav */}
        <div className="flex gap-1 border-b p-2 md:hidden overflow-x-auto">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setSection(item.id)}
              className={`flex shrink-0 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                section === item.id ? "bg-primary/10 text-primary" : "text-muted-foreground"
              }`}
            >
              <item.icon className="h-3.5 w-3.5" />
              {item.label}
            </button>
          ))}
        </div>
        <main className="flex-1 overflow-y-auto p-6">
          {section === "dashboard" && <StudentWelcome />}
          {section === "assistant" && <AcademicAssistant />}
          {section === "predictor" && <EamcetPredictor />}
          {section === "recommender" && <BranchRecommender />}
        </main>
      </div>
    </div>
  );
}
