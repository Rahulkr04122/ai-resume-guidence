// src/components/dashboard/AnalysisRunner.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface Resume { id: string; fileName: string; targetRole: string | null }

export function AnalysisRunner({
  resumes,
  defaultResumeId,
}: {
  resumes: Resume[];
  defaultResumeId?: string;
}) {
  const router = useRouter();
  const [resumeId, setResumeId] = useState(
    defaultResumeId || resumes[0]?.id || ""
  );
  const [targetRole, setTargetRole] = useState("");
  const [loading, setLoading] = useState(false);

  async function run() {
    if (!resumeId) { toast.error("Select a resume first"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeId, targetRole }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success("Analysis complete!");
      router.refresh();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Analysis failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card space-y-4">
      <div className="badge-gold">Run Analysis</div>

      <div>
        <label className="block text-xs font-medium text-obsidian-300 mb-1.5">
          Select Resume
        </label>
        <select
          className="input"
          value={resumeId}
          onChange={(e) => setResumeId(e.target.value)}
        >
          {resumes.map((r) => (
            <option key={r.id} value={r.id}>
              {r.fileName}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-obsidian-300 mb-1.5">
          Target Role (optional)
        </label>
        <input
          type="text"
          className="input"
          placeholder="e.g. Engineering Manager"
          value={targetRole}
          onChange={(e) => setTargetRole(e.target.value)}
        />
      </div>

      <button onClick={run} disabled={loading} className="btn-primary w-full">
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-obsidian-950/30 border-t-obsidian-950 rounded-full animate-spin" />
            Analyzing with AI...
          </span>
        ) : (
          "Analyze with AI →"
        )}
      </button>

      {loading && (
        <p className="text-xs text-obsidian-400 text-center">
          This takes 10-20 seconds
        </p>
      )}
    </div>
  );
}