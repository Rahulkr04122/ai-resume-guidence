// src/app/dashboard/resume/page.tsx
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ResumeUploader } from "@/components/dashboard/ResumeUploader";
import { formatDate, formatBytes } from "@/lib/utils";
import Link from "next/link";

export default async function ResumePage() {
  const user = await getSession();
  if (!user) redirect("/auth/login");

  const resumes = await prisma.resume.findMany({
    where: { userId: user.id },
    include: {
      analyses: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-4xl mx-auto animate-fade-up">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-4xl text-[#f0ede8] mb-1">
          Resumes
        </h1>
        <p className="text-obsidian-400 text-sm">
          Upload your resume for AI-powered analysis
        </p>
      </div>

      {/* Uploader component */}
      <ResumeUploader />

      {/* List of uploaded resumes */}
      {resumes.length > 0 && (
        <div className="mt-8">
          <h2 className="font-display text-xl text-[#f0ede8] mb-4">
            Your Resumes
          </h2>
          <div className="space-y-3">
            {resumes.map((r) => {
              const latest = r.analyses[0];
              return (
                <div
                  key={r.id}
                  className="card flex items-center gap-4 hover:border-ember-500/15 transition-colors"
                >
                  <div className="text-2xl">📄</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-[#f0ede8] truncate">
                      {r.fileName}
                    </div>
                    <div className="text-xs text-obsidian-400 mt-0.5">
                      {formatBytes(r.fileSize)} · {r.wordCount} words ·{" "}
                      {formatDate(r.createdAt)}
                      {r.targetRole && ` · ${r.targetRole}`}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {latest ? (
                      <span className="badge-gold text-xs">
                        Score: {latest.overallScore}
                      </span>
                    ) : (
                      <span className="text-xs text-obsidian-500">
                        Not analyzed
                      </span>
                    )}
                    <Link
                      href={`/dashboard/analysis?resumeId=${r.id}`}
                      className="btn-primary text-xs px-3 py-1.5"
                    >
                      {latest ? "Re-analyze" : "Analyze →"}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}