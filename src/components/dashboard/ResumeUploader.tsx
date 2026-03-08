// src/components/dashboard/ResumeUploader.tsx
"use client";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { cn, formatBytes } from "@/lib/utils";

export function ResumeUploader() {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [targetRole, setTargetRole] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const onDrop = useCallback((accepted: File[]) => {
    if (accepted[0]) setFile(accepted[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "text/plain": [".txt"],
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
  });

  async function handleUpload() {
    if (!file) { toast.error("Please select a file first"); return; }
    setUploading(true);

    const fd = new FormData();
    fd.append("resume", file);
    if (targetRole) fd.append("targetRole", targetRole);

    try {
      const res = await fetch("/api/resume/upload", {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success("Resume uploaded! Ready to analyze.");
      setFile(null);
      setTargetRole("");
      router.refresh();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="card space-y-4">
      <div className="badge-gold">Upload Resume</div>

      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-200",
          isDragActive
            ? "border-ember-500/60 bg-ember-500/5"
            : "border-white/10 hover:border-ember-500/30 hover:bg-white/2",
          file && "border-emerald-500/40 bg-emerald-500/5"
        )}
      >
        <input {...getInputProps()} />
        {file ? (
          <div>
            <div className="text-3xl mb-2">✅</div>
            <p className="text-sm font-medium text-emerald-400">
              {file.name}
            </p>
            <p className="text-xs text-obsidian-400 mt-1">
              {formatBytes(file.size)} · Click to change
            </p>
          </div>
        ) : (
          <div>
            <div className="text-4xl mb-3 opacity-50">📄</div>
            <p className="text-sm font-medium text-[#f0ede8] mb-1">
              {isDragActive
                ? "Drop it here!"
                : "Drag & drop your resume"}
            </p>
            <p className="text-xs text-obsidian-400">
              PDF, DOCX, or TXT · max 5MB
            </p>
          </div>
        )}
      </div>

      <div>
        <label className="block text-xs font-medium text-obsidian-300 mb-1.5">
          Target Role (optional)
        </label>
        <input
          type="text"
          className="input"
          placeholder="e.g. Engineering Manager, Senior Engineer"
          value={targetRole}
          onChange={(e) => setTargetRole(e.target.value)}
        />
      </div>

      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className="btn-primary w-full"
      >
        {uploading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-obsidian-950/30 border-t-obsidian-950 rounded-full animate-spin" />
            Uploading & parsing...
          </span>
        ) : (
          "Upload Resume →"
        )}
      </button>
    </div>
  );
}