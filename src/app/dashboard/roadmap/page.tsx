import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { RoadmapGenerator } from "@/components/dashboard/RoadmapGenerator";
import { RoadmapView } from "@/components/dashboard/RoadmapView";

export default async function RoadmapPage() {
  const user = await getSession();
  if (!user) redirect("/auth/login");

  const [resumes, roadmaps] = await Promise.all([
    prisma.resume.findMany({
      where: { userId: user.id },
      select: { id: true, fileName: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.roadmap.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  const latest = roadmaps[0] ?? null;

  return (
    <div className="max-w-5xl mx-auto animate-fade-up">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-4xl text-[#f0ede8] mb-1">
          Career Roadmap
        </h1>
        <p className="text-obsidian-400 text-sm">
          AI-generated personalised path to your next role
        </p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left column — generator + history */}
        <div className="col-span-1 space-y-4">
          <RoadmapGenerator
            resumes={resumes}
            defaultCurrentRole={user.title || ""}
            defaultTargetRole={user.targetRole || ""}
          />

          {/* Previous roadmaps */}
          {roadmaps.length > 1 && (
            <div className="card">
              <div className="badge-gold mb-4">Previous Roadmaps</div>
              <div className="space-y-2">
                {roadmaps.slice(1).map((r) => (
                  <div
                    key={r.id}
                    className="text-xs text-obsidian-400 py-2 border-b border-white/5 last:border-0"
                  >
                    <div className="text-[#f0ede8] font-medium">
                      {r.currentRole} → {r.targetRole}
                    </div>
                    <div className="mt-0.5">{r.timeline}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right column — roadmap view */}
        <div className="col-span-2">
          {latest ? (
            <RoadmapView roadmap={latest} />
          ) : (
            <div className="card h-72 flex flex-col items-center justify-center text-center gap-3">
              <div className="text-4xl opacity-20">🗺</div>
              <p className="text-sm text-obsidian-400">
                Generate a roadmap to see your personalised career path
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}