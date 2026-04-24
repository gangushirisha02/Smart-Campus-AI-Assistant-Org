import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TrendingUp, GraduationCap, Award, MapPin, CheckCircle2, XCircle } from "lucide-react";
import { motion } from "framer-motion";

interface PredictionResult {
  college: string;
  branch: string;
  location: string;
  chance: string;
  scholarship: string;
}

interface ScholarshipResult {
  title: string;
  criteria: string;
  eligible: boolean;
}

export function EamcetPredictor() {
  const [rank, setRank] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("male");
  const [income, setIncome] = useState("");
  const [caste, setCaste] = useState("OC");
  const [results, setResults] = useState<PredictionResult[] | null>(null);
  const [evaluatedScholarships, setEvaluatedScholarships] = useState<ScholarshipResult[] | null>(null);
  const [loading, setLoading] = useState(false);

  const predict = () => {
    if (!rank) return;
    setLoading(true);
    setTimeout(() => {
      const rankNum = parseInt(rank);
      const incomeNum = parseInt(income) || 0;
      const hasIncome = income !== "";
      const predictions: PredictionResult[] = [];

      if (rankNum <= 5000) {
        predictions.push(
          { college: "JNTU Hyderabad", branch: "CSE", location: "Hyderabad", chance: "High", scholarship: "Merit-based (100%)" },
          { college: "OU College of Engineering", branch: "CSE", location: "Hyderabad", chance: "High", scholarship: "Tuition Fee Waiver" },
          { college: "CBIT", branch: "CSE", location: "Hyderabad", chance: "Very High", scholarship: "Merit Scholarship" },
        );
      } else if (rankNum <= 15000) {
        predictions.push(
          { college: "VNR VJIET", branch: "IT", location: "Hyderabad", chance: "High", scholarship: caste !== "OC" ? "Category-based" : "None" },
          { college: "MVSR Engineering", branch: "CSE", location: "Hyderabad", chance: "Medium", scholarship: "Partial Waiver" },
          { college: "Vasavi College", branch: "ECE", location: "Hyderabad", chance: "High", scholarship: caste !== "OC" ? "Fee Concession" : "None" },
        );
      } else {
        predictions.push(
          { college: "GRIET", branch: "ECE", location: "Hyderabad", chance: "High", scholarship: caste !== "OC" ? "Category Scholarship" : "None" },
          { college: "BVRIT", branch: "IT", location: "Narsapur", chance: "Very High", scholarship: incomeNum < 200000 ? "Income-based" : "None" },
          { college: "CMR Engineering", branch: "CSE", location: "Hyderabad", chance: "High", scholarship: "Management Quota Available" },
        );
      }

      const scholarships: ScholarshipResult[] = [
        { title: "Merit-based (100% Tuition)", criteria: "EAMCET Rank ≤ 5,000 in any category", eligible: rankNum <= 5000 },
        { title: "Category-based (BC/SC/ST)", criteria: "Family income ≤ ₹2,00,000/year + valid caste certificate", eligible: hasIncome && incomeNum <= 200000 && ["BC", "SC", "ST"].includes(caste) },
        { title: "EWS Scholarship", criteria: "EWS category + Family income ≤ ₹8,00,000/year", eligible: caste === "EWS" && hasIncome && incomeNum <= 800000 },
        { title: "Income-based Fee Concession", criteria: "Family income ≤ ₹2,00,000/year (any category)", eligible: hasIncome && incomeNum <= 200000 },
        { title: "Girl Child Scholarship", criteria: "Female students with EAMCET Rank ≤ 20,000", eligible: gender === "female" && rankNum <= 20000 },
        { title: "Management Quota Partial Waiver", criteria: "Rank ≤ 50,000 + exceptional extracurricular achievements", eligible: rankNum <= 50000 },
      ];

      setResults(predictions);
      setEvaluatedScholarships(scholarships);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-2xl font-bold text-foreground">EAMCET College Predictor</h2>
        <p className="text-sm text-muted-foreground mt-1">Enter your details to get college predictions</p>
      </div>

      <Card className="border-none shadow-sm">
        <CardContent className="p-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">EAMCET Rank *</label>
              <Input placeholder="Enter your rank" value={rank} onChange={(e) => setRank(e.target.value)} type="number" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Age</label>
              <Input placeholder="Enter your age" value={age} onChange={(e) => setAge(e.target.value)} type="number" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Family Income (₹/year)</label>
              <Input placeholder="e.g., 300000" value={income} onChange={(e) => setIncome(e.target.value)} type="number" />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-medium text-foreground">Caste Category</label>
              <select
                value={caste}
                onChange={(e) => setCaste(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
              >
                <option value="OC">OC (Open Category)</option>
                <option value="BC">BC (Backward Class)</option>
                <option value="SC">SC (Scheduled Caste)</option>
                <option value="ST">ST (Scheduled Tribe)</option>
                <option value="EWS">EWS</option>
              </select>
            </div>
          </div>
          <Button onClick={predict} disabled={!rank || loading} className="w-full" size="lg">
            {loading ? "Predicting..." : "Predict Colleges & Branches"}
          </Button>
        </CardContent>
      </Card>

      {/* Scholarship Eligibility Criteria (Shown before prediction) */}
      {!results && (
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Award className="h-5 w-5 text-campus-emerald" />
              Scholarship Eligibility Criteria
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { title: "Merit-based (100% Tuition)", criteria: "EAMCET Rank ≤ 5,000 in any category" },
              { title: "Category-based (BC/SC/ST)", criteria: "Family income ≤ ₹2,00,000/year + valid caste certificate" },
              { title: "EWS Scholarship", criteria: "EWS category + Family income ≤ ₹8,00,000/year" },
              { title: "Income-based Fee Concession", criteria: "Family income ≤ ₹2,00,000/year (any category)" },
              { title: "Girl Child Scholarship", criteria: "Female students with EAMCET Rank ≤ 20,000" },
              { title: "Management Quota Partial Waiver", criteria: "Rank ≤ 50,000 + exceptional extracurricular achievements" },
            ].map((s, idx) => (
              <div key={idx} className="rounded-lg bg-muted/50 p-4">
                <p className="text-sm font-medium text-foreground">{s.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{s.criteria}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {results && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <h3 className="font-heading text-lg font-semibold text-foreground">Predicted Results</h3>
          {results.map((r, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.15 }}
            >
              <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-5 w-5 text-primary" />
                        <h4 className="font-medium text-foreground">{r.college}</h4>
                      </div>
                      <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1"><TrendingUp className="h-3.5 w-3.5" />{r.branch}</span>
                        <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{r.location}</span>
                      </div>
                      {r.scholarship !== "None" && (
                        <div className="flex items-center gap-1 text-sm text-campus-emerald">
                          <Award className="h-3.5 w-3.5" />
                          <span>{r.scholarship}</span>
                        </div>
                      )}
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                      r.chance === "Very High" ? "bg-campus-emerald/10 text-campus-emerald" :
                      r.chance === "High" ? "bg-primary/10 text-primary" :
                      "bg-campus-amber/10 text-campus-amber"
                    }`}>
                      {r.chance} Chance
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}

          {/* Scholarship Eligibility Summary (Shown after prediction) */}
          <Card className="mt-8 border-none shadow-sm bg-muted/30">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Award className="h-5 w-5 text-campus-emerald" />
                Your Scholarship Eligibility
              </CardTitle>
            </CardHeader>
            <CardContent>
              {evaluatedScholarships && evaluatedScholarships.filter(s => s.eligible).length > 0 ? (
                <div className="space-y-3 mt-2">
                  <p className="text-sm font-medium text-foreground">Based on your details, you are eligible for the following:</p>
                  <ul className="space-y-3">
                    {evaluatedScholarships.filter(s => s.eligible).map((s, idx) => (
                      <li key={idx} className="flex gap-3 text-sm bg-campus-emerald/5 p-3 rounded-md border border-campus-emerald/20">
                        <CheckCircle2 className="h-5 w-5 text-campus-emerald flex-shrink-0" />
                        <div>
                          <span className="font-semibold text-campus-emerald">Eligible for {s.title}</span>
                          <p className="text-muted-foreground mt-0.5">Reason: You meet the criteria ({s.criteria})</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="flex gap-3 text-sm bg-muted/50 p-4 rounded-md mt-2">
                  <XCircle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-foreground">Not Eligible for Scholarships</span>
                    <p className="text-muted-foreground mt-0.5">Based on the provided details, you do not currently meet the criteria for any of the available scholarships.</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
