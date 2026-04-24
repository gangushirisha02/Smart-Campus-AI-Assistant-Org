import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { GraduationCap, Shield, BookOpen, Brain, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Smart Campus AI Assistant" },
      { name: "description", content: "AI-powered campus assistant for EAMCET predictions, academic help, and branch recommendations" },
      { property: "og:title", content: "Smart Campus AI Assistant" },
      { property: "og:description", content: "AI-powered campus assistant for EAMCET predictions, academic help, and branch recommendations" },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <header className="relative overflow-hidden bg-campus-navy py-20">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: "radial-gradient(circle at 25% 50%, oklch(0.65 0.16 260 / 30%) 0%, transparent 50%), radial-gradient(circle at 75% 50%, oklch(0.55 0.17 160 / 20%) 0%, transparent 50%)"
          }} />
        </div>
        <div className="relative mx-auto max-w-6xl px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/20">
              <Brain className="h-10 w-10 text-primary-foreground" />
            </div>
            <h1 className="font-heading text-4xl font-bold tracking-tight text-campus-navy-foreground md:text-5xl">
              Smart Campus AI Assistant
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-campus-navy-foreground/70">
              Your intelligent companion for EAMCET college predictions, academic guidance, and personalized branch recommendations.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          >
            <Link to="/student-signup">
              <Button variant="hero" size="lg" className="gap-2 text-base px-8 py-6">
                <GraduationCap className="h-5 w-5" />
                Student Sign Up
              </Button>
            </Link>
            <Link to="/admin-signup">
              <Button variant="emerald" size="lg" className="gap-2 text-base px-8 py-6">
                <Shield className="h-5 w-5" />
                Admin Sign Up
              </Button>
            </Link>
          </motion.div>
        </div>
      </header>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-center font-heading text-3xl font-bold text-foreground">Powerful Features</h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-muted-foreground">
          Leverage AI to make smarter decisions about your academic future
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            { icon: TrendingUp, title: "EAMCET Predictor", desc: "Get college & branch predictions based on your rank, category, and preferences.", color: "bg-campus-emerald/10 text-campus-emerald" },
            { icon: Brain, title: "Academic Assistant", desc: "AI-powered chatbot that answers academic queries using campus knowledge base.", color: "bg-primary/10 text-primary" },
            { icon: BookOpen, title: "Branch Recommender", desc: "Discover the best engineering branches matching your interests and strengths.", color: "bg-campus-amber/10 text-campus-amber" },
          ].map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.15 }}
            >
              <Card className="h-full border-none shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className={`mb-3 flex h-12 w-12 items-center justify-center rounded-xl ${f.color}`}>
                    <f.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-lg">{f.title}</CardTitle>
                  <CardDescription>{f.desc}</CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        <p>© 2026 Smart Campus AI Assistant. All rights reserved.</p>
        <p className="mt-1">Demo credentials: admin@campus.edu / admin123 • student@campus.edu / student123</p>
      </footer>
    </div>
  );
}
