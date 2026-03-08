// src/app/dashboard/analysis/page.tsx
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { AnalysisRunner } from "@/components/dashboard/AnalysisRunner";
import { AnalysisResult } from "@/components/dashboard/AnalysisResult";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

export default async function AnalysisPage({
  searchParams,
}: {
  searchParams: { resumeId?: string };
}) {
  const user = await getSession();
  if (!user) redirect("/auth/login");

  const [resumes, analyses] = await Promise.all([
    prisma.resume.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      select: { id: true, fileName: true, targetRole: true },
    }),
    prisma.analysis.findMany({
      where: { userId: user.id },
      include: { resume: { select: { fileName: true } } },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
  ]);

  const featured = analyses[0] ?? null;

  if (resumes.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-24 animate-fade-up">
        <div className="text-6xl mb-4 opacity-30">🔍</div>
        <h1 className="font-display text-3xl text-[#f0ede8] mb-3">
          No resumes yet
        </h1>
        <p className="text-obsidian-400 text-sm mb-6">
          Upload a resume first to run AI analysis.
        </p>
        <Link href="/dashboard/resume" className="btn-primary">
          Upload Resume →
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto animate-fade-up">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-4xl text-[#f0ede8] mb-1">
          AI Analysis
        </h1>
        <p className="text-obsidian-400 text-sm">
          Deep resume analysis powered by Claude
        </p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left column — run analysis + history */}
        <div className="col-span-1 space-y-4">
          <AnalysisRunner
            resumes={resumes}
            defaultResumeId={searchParams.resumeId}
          />

          {/* History */}
          {analyses.length > 0 && (
            <div className="card">
              <div className="badge-gold mb-4">History</div>
              <div className="space-y-2">
                {analyses.slice(0, 6).map((a) => (
                  <div
                    key={a.id}
                    className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0"
                  >
                    <div className="text-sm font-semibold text-ember-400 w-8">
                      {a.overallScore}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-[#f0ede8] truncate">
                        {a.resume.fileName}
                      </div>
                      <div className="text-xs text-obsidian-500">
                        {formatDate(a.createdAt)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right column — results */}
        <div className="col-span-2">
          {featured ? (
            <AnalysisResult analysis={featured} />
          ) : (
            <div className="card h-64 flex flex-col items-center justify-center text-center gap-3">
              <div className="text-4xl opacity-20">📊</div>
              <p className="text-sm text-obsidian-400">
                Run an analysis to see results here
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}