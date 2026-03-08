// src/components/dashboard/SkillBars.tsx
import { scoreBarColor } from "@/lib/utils";

const LABELS: Record<string, string> = {
  impactAndMetrics:     "Impact & Metrics",
  clarityAndFormatting: "Clarity & Formatting",
  atsKeywords:          "ATS Keywords",
  skillsAlignment:      "Skills Alignment",
  experienceDepth:      "Experience Depth",
};

export function SkillBars({ scores }: { scores: Record<string, number> }) {
  return (
    <div className="space-y-4">
      {Object.entries(scores).map(([key, val]) => (
        <div key={key}>
          <div className="flex justify-between text-sm mb-1.5">
            <span className="text-obsidian-300 font-medium">
              {LABELS[key] ?? key}
            </span>
            <span className="text-obsidian-400">{val}%</span>
          </div>
          <div className="h-1.5 bg-obsidian-700 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${scoreBarColor(val)}`}
              style={{ width: `${val}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}