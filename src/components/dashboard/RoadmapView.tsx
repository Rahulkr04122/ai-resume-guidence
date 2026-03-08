// src/components/dashboard/RoadmapView.tsx
import { scoreBarColor } from "@/lib/utils";

interface Phase {
  phase: number;
  name: string;
  duration: string;
  objective: string;
  keyActions: string[];
  skillsToAcquire: string[];
  milestoneMarker: string;
}
interface GapItem {
  skill: string;
  currentLevel: number;
  requiredLevel: number;
}
interface Resource {
  type: string;
  title: string;
  rationale: string;
}
interface Roadmap {
  title: string;
  overview: string;
  currentRole: string;
  targetRole: string;
  timeline: string;
  phases: unknown;
  gapAnalysis: unknown;
  resources: unknown;
}

const typeIcon: Record<string, string> = {
  book: "📚", course: "🎓", community: "👥", tool: "🛠",
};

export function RoadmapView({ roadmap }: { roadmap: Roadmap }) {
  const phases = roadmap.phases as Phase[];
  const gaps = roadmap.gapAnalysis as GapItem[];
  const resources = roadmap.resources as Resource[];

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header */}
      <div className="card">
        <div className="badge-gold mb-3">AI Generated</div>
        <h2 className="font-display text-2xl text-[#f0ede8] mb-2">
          {roadmap.title}
        </h2>
        <p className="text-sm text-obsidian-300 leading-relaxed mb-3">
          {roadmap.overview}
        </p>
        <div className="flex items-center gap-3 text-xs text-obsidian-400">
          <span className="text-ember-400 font-medium">
            {roadmap.currentRole}
          </span>
          <span>→</span>
          <span className="text-emerald-400 font-medium">
            {roadmap.targetRole}
          </span>
          <span>·</span>
          <span>{roadmap.timeline}</span>
        </div>
      </div>

      {/* Timeline */}
      <div className="card">
        <div className="text-xs font-semibold text-obsidian-400 uppercase tracking-wider mb-5">
          Career Phases
        </div>
        <div className="relative">
          <div className="absolute left-3 top-2 bottom-2 w-px bg-gradient-to-b from-ember-500 via-obsidian-600 to-transparent" />
          <div className="space-y-6 pl-10">
            {phases.map((phase, i) => (
              <div key={i} className="relative">
                <div
                  className={`absolute -left-7 top-1 w-3 h-3 rounded-full border-2 border-obsidian-950 ${
                    i < 2 ? "bg-ember-400" : "bg-obsidian-500"
                  }`}
                />
                <div className="text-xs font-bold text-ember-400 uppercase tracking-wider mb-1">
                  {phase.duration}
                </div>
                <h3 className="font-semibold text-[#f0ede8] text-sm mb-1">
                  Phase {phase.phase}: {phase.name}
                </h3>
                <p className="text-xs text-obsidian-300 mb-2 leading-relaxed">
                  {phase.objective}
                </p>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {phase.skillsToAcquire.map((s) => (
                    <span
                      key={s}
                      className="px-2 py-0.5 text-xs rounded-full bg-obsidian-700/50 border border-white/8 text-obsidian-300"
                    >
                      {s}
                    </span>
                  ))}
                </div>
                <div className="text-xs text-obsidian-400 italic border-l-2 border-ember-500/30 pl-2">
                  ✓ {phase.milestoneMarker}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Gap analysis */}
      <div className="card">
        <div className="text-xs font-semibold text-obsidian-400 uppercase tracking-wider mb-4">
          Skill Gap Analysis
        </div>
        <div className="space-y-3">
          {gaps.map((g) => (
            <div key={g.skill}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-obsidian-300 font-medium">
                  {g.skill}
                </span>
                <span className="text-obsidian-500">
                  {g.currentLevel}% → {g.requiredLevel}%
                </span>
              </div>
              <div className="h-1.5 bg-obsidian-700 rounded-full overflow-hidden relative">
                <div
                  className="h-full bg-obsidian-500/50 rounded-full absolute"
                  style={{ width: `${g.requiredLevel}%` }}
                />
                <div
                  className={`h-full rounded-full ${scoreBarColor(g.currentLevel)}`}
                  style={{ width: `${g.currentLevel}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Resources */}
      <div className="card">
        <div className="text-xs font-semibold text-obsidian-400 uppercase tracking-wider mb-4">
          Recommended Resources
        </div>
        <div className="space-y-2">
          {resources.map((r, i) => (
            <div
              key={i}
              className="flex gap-3 py-2 border-b border-white/5 last:border-0"
            >
              <span className="text-lg shrink-0">
                {typeIcon[r.type] ?? "📖"}
              </span>
              <div>
                <div className="text-sm font-medium text-[#f0ede8]">
                  {r.title}
                </div>
                <div className="text-xs text-obsidian-400 mt-0.5">
                  {r.rationale}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}