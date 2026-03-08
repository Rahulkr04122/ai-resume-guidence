// src/app/api/resume/route.ts
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const user = await getSession();
  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const resumes = await prisma.resume.findMany({
    where: { userId: user.id },
    select: {
      id:         true,
      fileName:   true,
      fileSize:   true,
      wordCount:  true,
      targetRole: true,
      createdAt:  true,
      analyses: {
        select: {
          id:           true,
          overallScore: true,
          grade:        true,
          createdAt:    true,
        },
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ success: true, resumes });
}