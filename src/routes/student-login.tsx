import { createFileRoute } from "@tanstack/react-router";
import { GraduationCap } from "lucide-react";
import { AuthForm } from "@/components/AuthForm";

export const Route = createFileRoute("/student-login")({
  head: () => ({
    meta: [
      { title: "Student Login — Smart Campus AI" },
      { name: "description", content: "Student login for Smart Campus AI Assistant" },
    ],
  }),
  component: StudentLoginPage,
});

function StudentLoginPage() {
  return (
    <AuthForm
      mode="login"
      role="student"
      title="Student Login"
      description="Sign in to access your academic dashboard"
      icon={<GraduationCap className="h-8 w-8 text-primary" />}
      redirectTo="/student"
      switchTo="/student-signup"
      switchLabel="Don't have an account? Sign Up"
    />
  );
}
