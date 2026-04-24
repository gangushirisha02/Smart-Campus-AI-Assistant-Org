import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { GitBranch, Lightbulb, CheckCircle, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const INTEREST_OPTIONS = [
  "Programming & Coding",
  "Mathematics & Logic",
  "Electronics & Hardware",
  "Data Science & Analytics",
  "Artificial Intelligence",
  "Web & App Development",
  "Mechanical Design",
  "Biology & Life Sciences",
  "Business & Management",
  "Creative Design",
  "Networking & Security",
  "Robotics & Automation",
];

interface BranchResult {
  branch: string;
  match: number;
  reason: string;
  careers: string[];
}

const BRANCH_MAP: Record<string, BranchResult[]> = {
  "Programming & Coding": [
    { branch: "Computer Science (CSE)", match: 95, reason: "Perfect for coding enthusiasts", careers: ["Software Developer", "Full Stack Engineer"] },
    { branch: "Information Technology (IT)", match: 85, reason: "Strong coding foundation with IT focus", careers: ["IT Consultant", "System Analyst"] },
  ],
  "Data Science & Analytics": [
    { branch: "CSE - Data Science", match: 95, reason: "Specialized in data and analytics", careers: ["Data Scientist", "ML Engineer"] },
    { branch: "AI & Machine Learning", match: 90, reason: "Strong overlap with data skills", careers: ["AI Researcher", "Analytics Lead"] },
  ],
  "Artificial Intelligence": [
    { branch: "AI & Machine Learning", match: 98, reason: "Direct alignment with AI passion", careers: ["AI Engineer", "Research Scientist"] },
    { branch: "CSE", match: 85, reason: "Broad foundation including AI", careers: ["ML Engineer", "Software Architect"] },
  ],
  "Electronics & Hardware": [
    { branch: "Electronics & Communication (ECE)", match: 95, reason: "Core electronics discipline", careers: ["VLSI Engineer", "Embedded Systems"] },
    { branch: "Electrical (EEE)", match: 80, reason: "Complementary electrical knowledge", careers: ["Power Systems Engineer"] },
  ],
};

export function BranchRecommender() {
  const [selected, setSelected] = useState<string[]>([]);
  const [extraInterests, setExtraInterests] = useState("");
  const [results, setResults] = useState<BranchResult[] | null>(null);
  const [loading, setLoading] = useState(false);

  const toggle = (interest: string) => {
    setSelected((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const recommend = () => {
    if (selected.length === 0) return;
    setLoading(true);
    setTimeout(() => {
      const allResults: BranchResult[] = [];
      const seen = new Set<string>();
      for (const interest of selected) {
        const mapped = BRANCH_MAP[interest] || [
          { branch: "CSE", match: 70, reason: `Related to ${interest}`, careers: ["Software Engineer"] },
        ];
        for (const r of mapped) {
          if (!seen.has(r.branch)) {
            seen.add(r.branch);
            allResults.push(r);
          }
        }
      }
      allResults.sort((a, b) => b.match - a.match);
      setResults(allResults.slice(0, 5));
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-2xl font-bold text-foreground">Branch Recommender</h2>
        <p className="text-sm text-muted-foreground mt-1">Select your interests to find the best branches</p>
      </div>

      <Card className="border-none shadow-sm">
        <CardContent className="p-6">
          <p className="text-sm font-medium text-foreground mb-4">Select your interests (choose multiple)</p>
          <div className="flex flex-wrap gap-2">
            {INTEREST_OPTIONS.map((interest) => (
              <button
                key={interest}
                onClick={() => toggle(interest)}
                className={`rounded-full border px-4 py-2 text-sm transition-all ${
                  selected.includes(interest)
                    ? "border-primary bg-primary/10 text-primary font-medium"
                    : "border-border bg-background text-muted-foreground hover:border-primary/50"
                }`}
              >
                {selected.includes(interest) && <CheckCircle className="mr-1.5 inline h-3.5 w-3.5" />}
                {interest}
              </button>
            ))}
          </div>

          <div className="mt-4 space-y-2">
            <label className="text-sm font-medium text-foreground">Additional interests (optional)</label>
            <Textarea
              placeholder="Describe any other interests, hobbies, or skills you have..."
              value={extraInterests}
              onChange={(e) => setExtraInterests(e.target.value)}
              rows={3}
            />
          </div>

          <Button
            onClick={recommend}
            disabled={selected.length === 0 || loading}
            className="mt-6 w-full"
            size="lg"
          >
            {loading ? "Analyzing..." : `Get Recommendations (${selected.length} selected)`}
          </Button>
        </CardContent>
      </Card>

      {results && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h3 className="font-heading text-lg font-semibold text-foreground">Recommended Branches</h3>
          </div>
          {results.map((r, i) => (
            <motion.div
              key={r.branch}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.12 }}
            >
              <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <GitBranch className="h-5 w-5 text-primary" />
                        <h4 className="font-medium text-foreground">{r.branch}</h4>
                      </div>
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Lightbulb className="h-3.5 w-3.5" />
                        {r.reason}
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {r.careers.map((c) => (
                          <span key={c} className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-2xl font-bold ${
                        r.match >= 90 ? "text-campus-emerald" :
                        r.match >= 75 ? "text-primary" : "text-campus-amber"
                      }`}>
                        {r.match}%
                      </span>
                      <p className="text-xs text-muted-foreground">Match</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
