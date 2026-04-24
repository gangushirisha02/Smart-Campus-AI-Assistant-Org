import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, FileText, BarChart3, GitBranch, ChevronRight, ArrowLeft, File } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { getUploadedFiles } from "@/lib/campus-store";

type KBView = "main" | "academic" | "cutoffs" | "branches" | "subjects";

const ACADEMIC_DATA = [
  { field: "Total Students", value: "1,245" },
  { field: "Average GPA", value: "7.8 / 10" },
  { field: "Pass Rate", value: "92%" },
  { field: "Departments", value: "8" },
];

const CUTOFF_DATA = [
  { college: "JNTU Hyderabad", branch: "CSE", oc: "5,200", bc: "8,400", sc: "15,000" },
  { college: "OU College of Engg", branch: "ECE", oc: "7,800", bc: "12,300", sc: "22,000" },
  { college: "CBIT", branch: "CSE", oc: "3,500", bc: "6,200", sc: "11,000" },
  { college: "VNR VJIET", branch: "IT", oc: "4,100", bc: "7,500", sc: "13,500" },
];

const BRANCH_DATA = [
  { interest: "Programming & Coding", branches: "CSE, IT, AI&ML" },
  { interest: "Electronics & Circuits", branches: "ECE, EEE" },
  { interest: "Mechanical Systems", branches: "Mechanical, Automobile" },
  { interest: "Biology & Research", branches: "Biotech, Biomedical" },
];

export function AdminKnowledgeBase() {
  const [view, setView] = useState<KBView>("main");
  const [uploadedFiles, setUploadedFiles] = useState(getUploadedFiles);

  useEffect(() => {
    const handler = () => setUploadedFiles(getUploadedFiles());
    window.addEventListener("campus-store-update", handler);
    return () => window.removeEventListener("campus-store-update", handler);
  }, []);

  // Count unique "subject" files (PDFs or documents)
  const subjectCount = uploadedFiles.length;

  if (view !== "main") {
    return <DetailView view={view} onBack={() => setView("main")} uploadedFiles={uploadedFiles} />;
  }

  const KB_ITEMS = [
    { id: "academic" as const, title: "Academic Data", desc: "Uploaded academic datasets and records", icon: BookOpen, count: 4 },
    { id: "cutoffs" as const, title: "EAMCET Cutoffs", desc: "Historical cutoff data across colleges", icon: BarChart3, count: CUTOFF_DATA.length },
    { id: "branches" as const, title: "Branch Recommendations", desc: "Branch mapping and recommendation data", icon: GitBranch, count: BRANCH_DATA.length },
    { id: "subjects" as const, title: "Subject PDFs", desc: "Uploaded syllabus and subject materials", icon: FileText, count: subjectCount },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-2xl font-bold text-foreground">Knowledge Base</h2>
        <p className="text-sm text-muted-foreground mt-1">Manage datasets and uploaded content</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Subjects Uploaded" value={String(subjectCount)} />
        <StatCard label="EAMCET Cutoffs" value={String(CUTOFF_DATA.length)} />
        <StatCard label="Branch Recommendations" value={String(BRANCH_DATA.length)} />
        <StatCard label="Current Datasets" value="4" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {KB_ITEMS.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card
              className="cursor-pointer border-none shadow-sm hover:shadow-md transition-all"
              onClick={() => setView(item.id)}
            >
              <CardContent className="flex items-center gap-4 p-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">{item.count}</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <Card className="border-none shadow-sm">
      <CardContent className="p-4 text-center">
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <p className="text-xs text-muted-foreground mt-1">{label}</p>
      </CardContent>
    </Card>
  );
}

function DetailView({ view, onBack, uploadedFiles }: { view: KBView; onBack: () => void; uploadedFiles: { id: string; name: string; size: number; uploadedAt: string }[] }) {
  const titles: Record<string, string> = {
    academic: "Academic Data",
    cutoffs: "EAMCET Cutoff Details",
    branches: "Branch Recommendation Details",
    subjects: "Subject PDFs",
  };

  return (
    <div className="space-y-4">
      <Button variant="ghost" onClick={onBack} className="gap-2">
        <ArrowLeft className="h-4 w-4" /> Back to Knowledge Base
      </Button>
      <h2 className="font-heading text-2xl font-bold text-foreground">{titles[view]}</h2>

      {view === "academic" && (
        <Card className="border-none shadow-sm">
          <CardContent className="p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              {ACADEMIC_DATA.map((d) => (
                <div key={d.field} className="rounded-lg bg-muted/50 p-4">
                  <p className="text-sm text-muted-foreground">{d.field}</p>
                  <p className="text-xl font-bold text-foreground mt-1">{d.value}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {view === "cutoffs" && (
        <Card className="border-none shadow-sm overflow-hidden">
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">College</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Branch</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">OC</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">BC</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">SC</th>
                </tr>
              </thead>
              <tbody>
                {CUTOFF_DATA.map((d, i) => (
                  <tr key={i} className="border-t">
                    <td className="px-4 py-3 font-medium">{d.college}</td>
                    <td className="px-4 py-3">{d.branch}</td>
                    <td className="px-4 py-3">{d.oc}</td>
                    <td className="px-4 py-3">{d.bc}</td>
                    <td className="px-4 py-3">{d.sc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {view === "branches" && (
        <Card className="border-none shadow-sm">
          <CardContent className="p-6 space-y-3">
            {BRANCH_DATA.map((d) => (
              <div key={d.interest} className="rounded-lg bg-muted/50 p-4">
                <p className="font-medium text-foreground">{d.interest}</p>
                <p className="text-sm text-muted-foreground mt-1">Recommended: {d.branches}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {view === "subjects" && (
        <div className="space-y-3">
          {uploadedFiles.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No subject files uploaded yet. Go to File Upload to add files.</p>
          ) : (
            uploadedFiles.map((pdf) => (
              <Card key={pdf.id} className="border-none shadow-sm cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
                    <File className="h-5 w-5 text-destructive" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground text-sm">{pdf.name}</p>
                    <p className="text-xs text-muted-foreground">Uploaded {new Date(pdf.uploadedAt).toLocaleDateString()}</p>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
