import { createFileRoute } from "@tanstack/react-router";
import { GraduationCap } from "lucide-react";
import { AuthForm } from "@/components/AuthForm";

export const Route = createFileRoute("/student-signup")({
  head: () => ({
    meta: [
      { title: "Student Sign Up — Smart Campus AI" },
      { name: "description", content: "Create a student account for Smart Campus AI Assistant" },
    ],
  }),
  component: StudentSignupPage,
});

function StudentSignupPage() {
  return (
    <AuthForm
      mode="signup"
      role="student"
      title="Student Sign Up"
      description="Create your account to access the academic dashboard"
      icon={<GraduationCap className="h-8 w-8 text-primary" />}
      redirectTo="/student"
      switchTo="/student-login"
      switchLabel="Already have an account? Sign In"
    />
  );
}
