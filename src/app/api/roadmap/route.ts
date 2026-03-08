import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateRoadmap } from "@/lib/ai";
import { z } from "zod";

const schema = z.object({
  currentRole:   z.string().min(1).max(100),
  targetRole:    z.string().min(1).max(100),
  yearsTimeline: z.number().int().min(1).max(10),
  resumeId:      z.string().optional(),
});

export async function POST(req: NextRequest) {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = schema.parse(await req.json());
    let resumeText: string | undefined;
    if (body.resumeId) {
      const resume = await prisma.resume.findFirst({
        where: { id: body.resumeId, userId: user.id },
      });
      if (resume) resumeText = resume.rawText.slice(0, 3000);
    }
    const result = await generateRoadmap(
      body.currentRole,
      body.targetRole,
      body.yearsTimeline,
      resumeText
    );
    const roadmap = await prisma.roadmap.create({
      data: {
        userId:      user.id,
        title:       result.title,
        overview:    result.overview,
        currentRole: body.currentRole,
        targetRole:  body.targetRole,
        timeline:    result.timeline,
        phases:      result.phases,
        gapAnalysis: result.gapAnalysis,
        resources:   result.resources,
      },
    });
    return NextResponse.json({ success: true, roadmap }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors[0].message }, { status: 422 });
    }
    console.error("Roadmap error:", err);
    return NextResponse.json({ error: "Roadmap generation failed." }, { status: 500 });
  }
}

export async function GET() {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const roadmaps = await prisma.roadmap.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ success: true, roadmaps });
}