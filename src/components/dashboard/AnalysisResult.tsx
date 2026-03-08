// src/components/dashboard/AnalysisResult.tsx
import { ScoreRing } from "./ScoreRing";
import { SkillBars } from "./SkillBars";
import { formatDate, scoreColor } from "@/lib/utils";

interface Strength { title: string; detail: string }
interface Improvement {
  priority: string;
  title: string;
  detail: string;
  example: string | null;
}
interface Analysis {
  id: string;
  overallScore: number;
  grade: string;
  summary: string;
  sectionScores: unknown;
  strengths: unknown;
  improvements: unknown;
  missingKeywords: unknown;
  topSkills: unknown;
  atsCompatible: boolean;
  targetRole: string | null;
  createdAt: Date;
  resume: { fileName: string };
}

export function AnalysisResult({ analysis }: { analysis: Analysis }) {
  const scores = analysis.sectionScores as Record<string, number>;
  const strengths = analysis.strengths as Strength[];
  const improvements = analysis.improvements as Improvement[];
  const keywords = analysis.missingKeywords as string[];
  const skills = analysis.topSkills as string[];

  const priorityColors: Record<string, string> = {
    high:   "text-red-400 bg-red-400/10 border-red-400/20",
    medium: "text-ember-400 bg-ember-400/10 border-ember-400/20",
    low:    "text-obsidian-300 bg-obsidian-700/30 border-white/8",
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Score header */}
      <div className="card">
        <div className="flex items-center gap-6">
          <ScoreRing
            score={analysis.overallScore}
            grade={analysis.grade}
          />
          <div className="flex-1">
            <div className="badge-gold mb-2">AI Analysis</div>
            <p className="text-sm text-obsidian-300 leading-relaxed">
              {analysis.summary}
            </p>
            <div className="flex items-center gap-3 mt-3">
              <span className={`text-xs font-medium ${analysis.atsCompatible ? "text-emerald-400" : "text-red-400"}`}>
                {analysis.atsCompatible ? "✓ ATS Compatible" : "✗ ATS Issues"}
              </span>
              {analysis.targetRole && (
                <span className="text-xs text-obsidian-400">
                  Target: {analysis.targetRole}
                </span>
              )}
              <span className="text-xs text-obsidian-500">
                {formatDate(analysis.createdAt)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Section scores */}
      <div className="card">
        <div className="text-xs font-semibold text-obsidian-400 uppercase tracking-wider mb-4">
          Section Scores
        </div>
        <SkillBars scores={scores} />
      </div>

      {/* Strengths */}
      <div className="card">
        <div className="text-xs font-semibold text-obsidian-400 uppercase tracking-wider mb-4">
          ✦ Strengths
        </div>
        <div className="space-y-3">
          {strengths.map((s, i) => (
            <div key={i} className="flex gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0" />
              <div>
                <div className="text-sm font-semibold text-emerald-400 mb-0.5">
                  {s.title}
                </div>
                <div className="text-xs text-obsidian-300 leading-relaxed">
                  {s.detail}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Improvements */}
      <div className="card">
        <div className="text-xs font-semibold text-obsidian-400 uppercase tracking-wider mb-4">
          ⚡ Improvements
        </div>
        <div className="space-y-3">
          {improvements.map((imp, i) => (
            <div
              key={i}
              className={`p-3 rounded-xl border ${priorityColors[imp.priority]}`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-wide opacity-70">
                  {imp.priority}
                </span>
                <span className="text-sm font-semibold">{imp.title}</span>
              </div>
              <p className="text-xs opacity-80 leading-relaxed mb-2">
                {imp.detail}
              </p>
              {imp.example && (
                <div className="bg-black/20 rounded-lg px-3 py-2 text-xs italic opacity-70 border border-white/5">
                  &quot;{imp.example}&quot;
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Keywords & Skills */}
      <div className="grid grid-cols-2 gap-4">
        <div className="card">
          <div className="text-xs font-semibold text-obsidian-400 uppercase tracking-wider mb-3">
            Missing Keywords
          </div>
          <div className="flex flex-wrap gap-1.5">
            {keywords.map((kw) => (
              <span
                key={kw}
                className="px-2 py-1 text-xs rounded-lg bg-red-500/10 border border-red-500/15 text-red-400"
              >
                {kw}
              </span>
            ))}
          </div>
        </div>
        <div className="card">
          <div className="text-xs font-semibold text-obsidian-400 uppercase tracking-wider mb-3">
            Top Skills Detected
          </div>
          <div className="flex flex-wrap gap-1.5">
            {skills.map((sk) => (
              <span
                key={sk}
                className="px-2 py-1 text-xs rounded-lg bg-emerald-500/10 border border-emerald-500/15 text-emerald-400"
              >
                {sk}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}