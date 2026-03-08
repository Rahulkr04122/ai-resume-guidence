// src/app/auth/login/page.tsx
"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      toast.success("Welcome back!");
      router.push("/dashboard");
      router.refresh();
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Login failed"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card w-full max-w-md relative z-10 animate-fade-up">
      {/* Logo */}
      <div className="flex items-center gap-2.5 mb-8">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-ember-400 to-ember-600 flex items-center justify-center text-obsidian-950 font-bold text-sm">
          A
        </div>
        <span className="font-display text-xl text-[#f0ede8]">Ascend</span>
      </div>

      <h1 className="font-display text-3xl text-[#f0ede8] mb-1">
        Welcome back
      </h1>
      <p className="text-obsidian-400 text-sm mb-8">
        Sign in to continue your career journey
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-obsidian-300 mb-1.5">
            Email
          </label>
          <input
            type="email"
            className="input"
            placeholder="you@company.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-obsidian-300 mb-1.5">
            Password
          </label>
          <input
            type="password"
            className="input"
            placeholder="••••••••"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
            required
          />
        </div>
        <button
          type="submit"
          className="btn-primary w-full mt-2"
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign In →"}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-obsidian-400">
        Don&apos;t have an account?{" "}
        <Link
          href="/auth/signup"
          className="text-ember-400 hover:text-ember-300 transition-colors"
        >
          Create one →
        </Link>
      </div>
    </div>
  );
}