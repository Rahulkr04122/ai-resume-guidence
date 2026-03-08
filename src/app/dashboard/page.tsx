// src/app/dashboard/page.tsx
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { formatDate, scoreColor, gradeColor } from "@/lib/utils";
import { ScoreRing } from "@/components/dashboard/ScoreRing";
import { SkillBars } from "@/components/dashboard/SkillBars";

export default async function DashboardPage() {
  const user = await getSession();
  if (!user) redirect("/auth/login");

  const [
    resumeCount,
    analysisCount,
    roadmapCount,
    latestAnalysis,
    recentAnalyses,
  ] = await Promise.all([
    prisma.resume.count({ where: { userId: user.id } }),
    prisma.analysis.count({ where: { userId: user.id } }),
    prisma.roadmap.count({ where: { userId: user.id } }),
    prisma.analysis.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      include: { resume: { select: { fileName: true } } },
    }),
    prisma.analysis.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 4,
      include: { resume: { select: { fileName: true } } },
    }),
  ]);

  const firstName = user.name.split(" ")[0];
  const sectionScores =
    latestAnalysis?.sectionScores as Record<string, number> | null;

  return (
    <div className="max-w-6xl mx-auto animate-fade-up">
      {/* Header */}
      <div className="mb-10">
        <h1 className="font-display text-4xl text-[#f0ede8] mb-1">
          Good to see you,{" "}
          <em className="text-ember-400 not-italic">{firstName}</em>
        </h1>
        <p className="text-obsidian-400 text-sm">
          {latestAnalysis
            ? `Last activity ${formatDate(latestAnalysis.createdAt)}`
            : "Upload your resume to get started"}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          {
            label: "Resumes",
            value: resumeCount,
            icon: "📄",
            href: "/dashboard/resume",
          },
          {
            label: "Analyses",
            value: analysisCount,
            icon: "🔍",
            href: "/dashboard/analysis",
          },
          {
            label: "Roadmaps",
            value: roadmapCount,
            icon: "🗺",
            href: "/dashboard/roadmap",
          },
          {
            label: "Best Score",
            value: latestAnalysis
              ? `${latestAnalysis.overallScore}`
              : "—",
            icon: "⭐",
            href: "/dashboard/analysis",
          },
        ].map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="card group hover:border-ember-500/20 transition-all duration-200 cursor-pointer"
          >
            <div className="flex items-start justify-between mb-3">
              <span className="text-2xl">{s.icon}</span>
              <span className="text-xs text-obsidian-500 group-hover:text-ember-400 transition-colors">
                →
              </span>
            </div>
            <div
              className={`font-display text-3xl mb-1 ${
                s.label === "Best Score"
                  ? scoreColor(Number(s.value))
                  : "text-[#f0ede8]"
              }`}
            >
              {s.value}
            </div>
            <div className="text-xs text-obsidian-400 font-medium uppercase tracking-wide">
              {s.label}
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6 mb-6">
        {/* Score ring */}
        {latestAnalysis ? (
          <div className="card col-span-1 flex flex-col items-center text-center">
            <div className="badge-gold mb-4 self-start">Latest Score</div>
            <ScoreRing
              score={latestAnalysis.overallScore}
              grade={latestAnalysis.grade}
            />
            <p className="text-xs text-obsidian-400 mt-4 leading-relaxed">
              {latestAnalysis.resume.fileName}
            </p>
          </div>
        ) : (
          <div className="card col-span-1 flex flex-col items-center justify-center text-center gap-3">
            <div className="text-4xl opacity-30">📊</div>
            <p className="text-sm text-obsidian-400">No analysis yet</p>
            <Link
              href="/dashboard/resume"
              className="btn-primary text-sm px-4 py-2"
            >
              Upload Resume →
            </Link>
          </div>
        )}

        {/* Skill bars */}
        {sectionScores ? (
          <div className="card col-span-2">
            <div className="badge-gold mb-4">Section Breakdown</div>
            <SkillBars scores={sectionScores} />
          </div>
        ) : (
          <div className="card col-span-2 flex items-center justify-center">
            <p className="text-sm text-obsidian-400">
              Run an analysis to see skill breakdown
            </p>
          </div>
        )}
      </div>

      {/* Recent analyses */}
      <div className="card">
        <div className="flex items-center justify-between mb-5">
          <div className="badge-gold">Recent Activity</div>
          <Link
            href="/dashboard/analysis"
            className="text-xs text-obsidian-400 hover:text-ember-400 transition-colors"
          >
            View all →
          </Link>
        </div>
        {recentAnalyses.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-obsidian-400 mb-3">
              No analyses yet. Upload a resume to get started.
            </p>
            <Link
              href="/dashboard/resume"
              className="btn-primary text-sm px-5 py-2"
            >
              Get Started →
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {recentAnalyses.map((a) => (
              <div
                key={a.id}
                className="flex items-center gap-4 px-4 py-3 rounded-xl bg-obsidian-800/40 border border-white/4 hover:border-ember-500/15 transition-colors"
              >
                <div
                  className={`font-display text-2xl font-semibold ${gradeColor(a.grade)} w-10 text-center`}
                >
                  {a.grade}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-[#f0ede8] truncate">
                    {a.resume.fileName}
                  </div>
                  <div className="text-xs text-obsidian-400">
                    {formatDate(a.createdAt)}
                  </div>
                </div>
                <div
                  className={`text-lg font-semibold ${scoreColor(a.overallScore)}`}
                >
                  {a.overallScore}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CTA for new users */}
      {resumeCount === 0 && (
        <div className="mt-6 card bg-gradient-to-br from-ember-500/8 to-transparent border-ember-500/15">
          <div className="flex items-center gap-5">
            <div className="text-4xl">🚀</div>
            <div className="flex-1">
              <h3 className="font-display text-xl text-[#f0ede8] mb-1">
                Ready to accelerate your career?
              </h3>
              <p className="text-sm text-obsidian-300">
                Upload your resume to get an AI-powered analysis in seconds.
              </p>
            </div>
            <Link href="/dashboard/resume" className="btn-primary shrink-0">
              Upload Resume →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}