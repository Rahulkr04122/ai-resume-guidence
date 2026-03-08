// src/app/api/auth/logout/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { deleteSession, clearSessionCookie } from "@/lib/auth";

export async function POST() {
  const token = cookies().get("ascend_session")?.value;
  if (token) await deleteSession(token);
  clearSessionCookie();
  return NextResponse.json({ success: true });
}