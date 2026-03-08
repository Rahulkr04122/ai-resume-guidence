// src/app/api/resume/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { extractText, countWords } from "@/lib/extractor";
import path from "path";
import fs from "fs/promises";
import { randomUUID } from "crypto";

const ALLOWED_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
];
const ALLOWED_EXTS = [".pdf", ".docx", ".txt"];
const MAX_BYTES = (Number(process.env.MAX_FILE_SIZE_MB) || 5) * 1024 * 1024;

export async function POST(req: NextRequest) {
  const user = await getSession();
  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const formData = await req.formData();
    const file = formData.get("resume") as File | null;
    const targetRole = (formData.get("targetRole") as string) || "";

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    const ext = path.extname(file.name).toLowerCase();
    if (!ALLOWED_TYPES.includes(file.type) || !ALLOWED_EXTS.includes(ext)) {
      return NextResponse.json(
        { error: "Unsupported file type. Use PDF, DOCX, or TXT." },
        { status: 422 }
      );
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: `File exceeds ${process.env.MAX_FILE_SIZE_MB || 5}MB limit.` },
        { status: 413 }
      );
    }

    const uploadDir = process.env.UPLOAD_DIR || "./public/uploads";
    await fs.mkdir(uploadDir, { recursive: true });
    const storedName = `${randomUUID()}${ext}`;
    const storagePath = path.join(uploadDir, storedName);
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(storagePath, buffer);

    let rawText: string;
    try {
      rawText = await extractText(buffer, file.name);
    } catch (e) {
      await fs.unlink(storagePath).catch(() => {});
      return NextResponse.json(
        { error: (e as Error).message },
        { status: 422 }
      );
    }

    if (!rawText || rawText.trim().length < 50) {
      await fs.unlink(storagePath).catch(() => {});
      return NextResponse.json(
        { error: "Could not extract text from file." },
        { status: 422 }
      );
    }

    const resume = await prisma.resume.create({
      data: {
        userId:      user.id,
        fileName:    file.name,
        fileSize:    file.size,
        mimeType:    file.type,
        storagePath,
        rawText,
        wordCount:   countWords(rawText),
        targetRole,
      },
    });

    return NextResponse.json({
      success: true,
      resume: {
        id:         resume.id,
        fileName:   resume.fileName,
        fileSize:   resume.fileSize,
        wordCount:  resume.wordCount,
        targetRole: resume.targetRole,
        createdAt:  resume.createdAt,
      },
    }, { status: 201 });

  } catch (err) {
    console.error("Resume upload error:", err);
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }     
}