import { Card, CardContent } from "@/components/ui/card";
import { Brain, BookOpen, TrendingUp, GitBranch, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth-context";

export function StudentWelcome() {
  const { user } = useAuth();

  const features = [
    { icon: Brain, title: "Academic Assistant", desc: "Ask any academic question and get AI-powered answers", color: "bg-primary/10 text-primary" },
    { icon: TrendingUp, title: "EAMCET Predictor", desc: "Predict colleges based on your rank and preferences", color: "bg-campus-emerald/10 text-campus-emerald" },
    { icon: GitBranch, title: "Branch Recommender", desc: "Find the best branch matching your interests", color: "bg-campus-amber/10 text-campus-amber" },
  ];

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-gradient-to-br from-primary/10 via-campus-emerald/5 to-transparent p-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="h-6 w-6 text-primary" />
          <span className="text-sm font-medium text-primary">Welcome back</span>
        </div>
        <h1 className="font-heading text-3xl font-bold text-foreground">
          Hello, {user?.name || "Student"}! 👋
        </h1>
        <p className="mt-2 text-muted-foreground max-w-lg">
          Your AI-powered campus assistant is ready to help with academics, college predictions, and career guidance.
        </p>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-3">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.1 }}
          >
            <Card className="border-none shadow-sm hover:shadow-md transition-shadow h-full">
              <CardContent className="p-6">
                <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${f.color}`}>
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="font-medium text-foreground">{f.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{f.desc}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card className="border-none shadow-sm">
        <CardContent className="p-6">
          <h3 className="font-medium text-foreground mb-3">Quick Tips</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Use the <strong>Academic Assistant</strong> to ask questions about any subject</li>
            <li>• Enter your EAMCET rank in the <strong>Predictor</strong> for college suggestions</li>
            <li>• Share your interests in <strong>Branch Recommender</strong> for career guidance</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
