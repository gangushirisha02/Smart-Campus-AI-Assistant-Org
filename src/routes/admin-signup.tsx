import { createFileRoute } from "@tanstack/react-router";
import { Shield } from "lucide-react";
import { AuthForm } from "@/components/AuthForm";

export const Route = createFileRoute("/admin-signup")({
  head: () => ({
    meta: [
      { title: "Admin Sign Up — Smart Campus AI" },
      { name: "description", content: "Create an admin account for Smart Campus AI Assistant" },
    ],
  }),
  component: AdminSignupPage,
});

function AdminSignupPage() {
  return (
    <AuthForm
      mode="signup"
      role="admin"
      title="Admin Sign Up"
      description="Create your admin account to manage the campus portal"
      icon={<Shield className="h-8 w-8 text-primary" />}
      redirectTo="/admin"
      switchTo="/admin-login"
      switchLabel="Already have an account? Sign In"
    />
  );
}
