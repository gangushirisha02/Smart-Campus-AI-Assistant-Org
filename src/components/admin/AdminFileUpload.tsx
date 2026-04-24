import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText, X, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import {
  getUploadedFiles,
  addUploadedFile,
  removeUploadedFile,
  type UploadedFile,
} from "@/lib/campus-store";

function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

export function AdminFileUpload() {
  const [files, setFiles] = useState<UploadedFile[]>(getUploadedFiles);
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    const handler = () => setFiles(getUploadedFiles());
    window.addEventListener("campus-store-update", handler);
    return () => window.removeEventListener("campus-store-update", handler);
  }, []);

  const processFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    Array.from(fileList).forEach((f) => {
      const entry: UploadedFile = {
        id: crypto.randomUUID(),
        name: f.name,
        size: f.size,
        type: f.type || "application/octet-stream",
        uploadedAt: new Date().toISOString(),
      };
      addUploadedFile(entry);
    });
  };

  const handleRemove = (id: string) => {
    removeUploadedFile(id);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-2xl font-bold text-foreground">File Upload</h2>
        <p className="text-sm text-muted-foreground mt-1">Upload syllabus, events, and academic files</p>
      </div>

      <input
        ref={inputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => processFiles(e.target.files)}
      />

      <Card
        className={`border-2 border-dashed transition-colors cursor-pointer ${dragOver ? "border-primary bg-primary/5" : "border-border"}`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); processFiles(e.dataTransfer.files); }}
        onClick={() => inputRef.current?.click()}
      >
        <CardContent className="flex flex-col items-center gap-4 py-12">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <Upload className="h-8 w-8 text-primary" />
          </div>
          <div className="text-center">
            <p className="font-medium text-foreground">Drag & drop files here</p>
            <p className="text-sm text-muted-foreground mt-1">or click to browse from your computer</p>
          </div>
          <Button variant="outline" onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}>
            <Upload className="mr-2 h-4 w-4" />
            Choose Files
          </Button>
        </CardContent>
      </Card>

      <div>
        <h3 className="font-medium text-foreground mb-3">Uploaded Files ({files.length})</h3>
        {files.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No files uploaded yet. Upload files from your computer to see them here.</p>
        ) : (
          <div className="space-y-2">
            {files.map((file, i) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="border-none shadow-sm">
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-campus-emerald/10">
                      <FileText className="h-5 w-5 text-campus-emerald" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{formatSize(file.size)} • {new Date(file.uploadedAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-campus-emerald" />
                      <button onClick={() => handleRemove(file.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
