// src/app/api/auth/register/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, createSession, setSessionCookie } from "@/lib/auth";
import { z } from "zod";

const schema = z.object({
  name:       z.string().min(1).max(80).trim(),
  email:      z.string().email().toLowerCase(),
  password:   z.string().min(8).max(128),
  title:      z.string().max(100).optional(),
  targetRole: z.string().max(100).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = schema.parse(body);

    const existing = await prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existing) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(data.password);
    const user = await prisma.user.create({
      data: {
        name:       data.name,
        email:      data.email,
        password:   passwordHash,
        title:      data.title,
        targetRole: data.targetRole,
      },
      select: {
        id:         true,
        name:       true,
        email:      true,
        plan:       true,
        title:      true,
        targetRole: true,
        createdAt:  true,
      },
    });

    const token = await createSession(user.id);
    setSessionCookie(token);

    return NextResponse.json({ success: true, user }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: err.errors[0].message },
        { status: 422 }
      );
    }
    console.error("Register error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}