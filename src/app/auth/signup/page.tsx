// src/app/auth/signup/page.tsx
"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    title: "",
    targetRole: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");
      toast.success("Account created! Welcome to Ascend 🎉");
      router.push("/dashboard");
      router.refresh();
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Signup failed"
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
        Create account
      </h1>
      <p className="text-obsidian-400 text-sm mb-8">
        Start your AI-powered career journey
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-obsidian-300 mb-1.5">
            Full Name
          </label>
          <input
            type="text"
            className="input"
            placeholder="Alex Johnson"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>
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
            placeholder="Min. 8 characters"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-obsidian-300 mb-1.5">
              Current Title
            </label>
            <input
              type="text"
              className="input"
              placeholder="e.g. Engineer"
              value={form.title}
              onChange={(e) =>
                setForm({ ...form, title: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-obsidian-300 mb-1.5">
              Target Role
            </label>
            <input
              type="text"
              className="input"
              placeholder="e.g. Manager"
              value={form.targetRole}
              onChange={(e) =>
                setForm({ ...form, targetRole: e.target.value })
              }
            />
          </div>
        </div>
        <button
          type="submit"
          className="btn-primary w-full mt-2"
          disabled={loading}
        >
          {loading ? "Creating account..." : "Create Account →"}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-obsidian-400">
        Already have an account?{" "}
        <Link
          href="/auth/login"
          className="text-ember-400 hover:text-ember-300 transition-colors"
        >
          Sign in →
        </Link>
      </div>
    </div>
  );
}