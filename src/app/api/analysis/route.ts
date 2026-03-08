// src/app/api/analysis/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { analyzeResume } from "@/lib/ai";

export async function POST(req: NextRequest) {
  const user = await getSession();
  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { resumeId, targetRole } = await req.json();
    if (!resumeId) {
      return NextResponse.json(
        { error: "resumeId required" },
        { status: 400 }
      );
    }

    const resume = await prisma.resume.findFirst({
      where: { id: resumeId, userId: user.id },
    });

    if (!resume) {
      return NextResponse.json(
        { error: "Resume not found" },
        { status: 404 }
      );
    }

    const start = Date.now();
    const result = await analyzeResume(
      resume.rawText,
      targetRole || resume.targetRole || ""
    );
    const durationMs = Date.now() - start;

    const analysis = await prisma.analysis.create({
      data: {
        userId:          user.id,
        resumeId:        resume.id,
        overallScore:    result.overallScore,
        grade:           result.grade,
        summary:         result.summary,
        sectionScores:   result.sectionScores,
        strengths:       result.strengths,
        improvements:    result.improvements,
        missingKeywords: result.missingKeywords,
        topSkills:       result.topSkillsDetected,
        atsCompatible:   result.atsCompatible,
        yearsExperience: result.estimatedYearsExperience,
        targetRole:      targetRole || resume.targetRole,
        durationMs,
      },
    });

    return NextResponse.json(
      { success: true, analysis },
      { status: 201 }
    );
  } catch (err) {
    console.error("Analysis error:", err);
    return NextResponse.json(
      { error: "Analysis failed. Please try again." },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const user = await getSession();
  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(req.url);
  const resumeId = searchParams.get("resumeId");

  const analyses = await prisma.analysis.findMany({
    where: {
      userId: user.id,
      ...(resumeId ? { resumeId } : {}),
    },
    include: { resume: { select: { fileName: true } } },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return NextResponse.json({ success: true, analyses });
}