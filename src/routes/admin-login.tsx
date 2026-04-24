import { createFileRoute } from "@tanstack/react-router";
import { Shield } from "lucide-react";
import { AuthForm } from "@/components/AuthForm";

export const Route = createFileRoute("/admin-login")({
  head: () => ({
    meta: [
      { title: "Admin Login — Smart Campus AI" },
      { name: "description", content: "Admin login for Smart Campus AI Assistant" },
    ],
  }),
  component: AdminLoginPage,
});

function AdminLoginPage() {
  return (
    <AuthForm
      mode="login"
      role="admin"
      title="Admin Login"
      description="Sign in to manage the campus portal"
      icon={<Shield className="h-8 w-8 text-primary" />}
      redirectTo="/admin"
      switchTo="/admin-signup"
      switchLabel="Don't have an account? Sign Up"
    />
  );
}
