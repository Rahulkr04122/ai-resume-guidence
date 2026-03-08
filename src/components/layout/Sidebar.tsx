// src/components/layout/Sidebar.tsx
"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard",          icon: "⬡", label: "Dashboard" },
  { href: "/dashboard/resume",   icon: "📄", label: "Resumes" },
  { href: "/dashboard/analysis", icon: "🔍", label: "Analysis" },
  { href: "/dashboard/roadmap",  icon: "🗺", label: "Roadmap" },
];

interface User { name: string; email: string; plan: string }

export function Sidebar({ user }: { user: User }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    toast.success("Signed out");
    router.push("/");
    router.refresh();
  }

  return (
    <aside className="fixed left-0 top-0 h-full w-60 bg-obsidian-900/80 border-r border-white/6 backdrop-blur-md flex flex-col px-4 py-6 z-50">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-2 mb-10">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-ember-400 to-ember-600 flex items-center justify-center text-obsidian-950 font-bold text-sm shrink-0">
          A
        </div>
        <span className="font-display text-xl text-[#f0ede8]">Ascend</span>
      </div>

      {/* Nav links */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/dashboard" &&
              pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
                active
                  ? "bg-ember-500/15 border border-ember-500/20 text-ember-300"
                  : "text-obsidian-300 hover:bg-white/5 hover:text-[#f0ede8]"
              )}
            >
              <span className="text-base w-5 text-center">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User card */}
      <div className="mt-auto space-y-2">
        <div className="flex items-center gap-2.5 px-3 py-3 rounded-xl bg-obsidian-800/50 border border-white/5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-ember-400 to-obsidian-600 flex items-center justify-center text-xs font-bold text-obsidian-950 shrink-0">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-[#f0ede8] truncate">
              {user.name}
            </div>
            <div className="text-xs text-ember-400 font-medium">
              {user.plan} Plan
            </div>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full text-left px-3 py-2 rounded-xl text-xs text-obsidian-400 hover:text-red-400 hover:bg-red-400/5 transition-all duration-150 border border-transparent hover:border-red-400/10"
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}