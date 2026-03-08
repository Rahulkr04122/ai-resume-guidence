// src/components/dashboard/RoadmapGenerator.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface Resume { id: string; fileName: string }

export function RoadmapGenerator({
  resumes,
  defaultCurrentRole,
  defaultTargetRole,
}: {
  resumes: Resume[];
  defaultCurrentRole: string;
  defaultTargetRole: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    currentRole:   defaultCurrentRole,
    targetRole:    defaultTargetRole,
    yearsTimeline: 2,
    resumeId:      resumes[0]?.id || "",
  });

  async function generate() {
    if (!form.currentRole || !form.targetRole) {
      toast.error("Please fill in current and target roles");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success("Roadmap generated!");
      router.refresh();
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Generation failed"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card space-y-4">
      <div className="badge-gold">Generate Roadmap</div>

      <div>
        <label className="block text-xs font-medium text-obsidian-300 mb-1.5">
          Current Role
        </label>
        <input
          type="text"
          className="input"
          placeholder="e.g. Software Engineer"
          value={form.currentRole}
          onChange={(e) =>
            setForm({ ...form, currentRole: e.target.value })
          }
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-obsidian-300 mb-1.5">
          Target Role
        </label>
        <input
          type="text"
          className="input"
          placeholder="e.g. Engineering Manager"
          value={form.targetRole}
          onChange={(e) =>
            setForm({ ...form, targetRole: e.target.value })
          }
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-obsidian-300 mb-1.5">
          Timeline
        </label>
        <select
          className="input"
          value={form.yearsTimeline}
          onChange={(e) =>
            setForm({ ...form, yearsTimeline: Number(e.target.value) })
          }
        >
          {[1, 2, 3, 5].map((y) => (
            <option key={y} value={y}>
              {y} year{y > 1 ? "s" : ""}
            </option>
          ))}
        </select>
      </div>

      {resumes.length > 0 && (
        <div>
          <label className="block text-xs font-medium text-obsidian-300 mb-1.5">
            Use Resume Context (optional)
          </label>
          <select
            className="input"
            value={form.resumeId}
            onChange={(e) =>
              setForm({ ...form, resumeId: e.target.value })
            }
          >
            <option value="">No resume</option>
            {resumes.map((r) => (
              <option key={r.id} value={r.id}>
                {r.fileName}
              </option>
            ))}
          </select>
        </div>
      )}

      <button
        onClick={generate}
        disabled={loading}
        className="btn-primary w-full"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-obsidian-950/30 border-t-obsidian-950 rounded-full animate-spin" />
            Generating...
          </span>
        ) : (
          "Generate with AI →"
        )}
      </button>

      {loading && (
        <p className="text-xs text-obsidian-400 text-center">
          This takes 15-25 seconds
        </p>
      )}
    </div>
  );
}