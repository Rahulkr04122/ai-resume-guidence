// src/app/page.tsx
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const user = await getSession();
  if (user) redirect("/dashboard");

  return (
    <main className="min-h-screen flex flex-col">
      <nav className="flex items-center justify-between px-8 py-6 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-ember-400 to-ember-600 flex items-center justify-center text-obsidian-950 font-bold text-sm">
            A
          </div>
          <span className="font-display text-xl tracking-wide text-[#f0ede8]">
            Ascend
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/auth/login" className="btn-ghost text-sm">
            Sign In
          </Link>
          <Link href="/auth/signup" className="btn-primary text-sm">
            Get Started
          </Link>
        </div>
      </nav>

      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24">
        <div className="badge-gold mb-6 animate-fade-in">
          Powered with AI
        </div>
        <h1 className="font-display text-6xl md:text-7xl lg:text-8xl leading-[1.05] tracking-tight text-[#f0ede8] max-w-4xl mb-6 animate-fade-up">
          Your career,
          <br />
          <em className="text-ember-400 not-italic">intelligently</em> elevated
        </h1>
        <p className="text-obsidian-300 text-lg md:text-xl max-w-xl mb-10 leading-relaxed animate-fade-up">
          AI-powered resume analysis, personalised career roadmaps, and
          interview coaching — all in one place.
        </p>
        <div className="flex gap-3 animate-fade-up">
          <Link href="/auth/signup" className="btn-primary px-8 py-3 text-base">
            Start for free
          </Link>
          <Link href="/auth/login" className="btn-ghost px-8 py-3 text-base">
            Sign in
          </Link>
        </div>

        <div className="flex flex-wrap gap-3 justify-center mt-16">
          {["Resume Analysis","Career Roadmap","Interview Coach","ATS Scoring","Skill Gap Analysis"].map((f) => (
            <span key={f} className="px-4 py-2 rounded-full border border-white/8 text-obsidian-300 text-sm bg-white/3 backdrop-blur-sm">
              {f}
            </span>
          ))}
        </div>
      </section>

      <section className="px-8 pb-24 max-w-6xl mx-auto w-full grid md:grid-cols-3 gap-5">
        {[
          { icon: "📄", title: "Resume Analysis", desc: "Deep AI analysis with ATS scoring, keyword gaps, and actionable line-by-line suggestions." },
          { icon: "🗺", title: "Career Roadmap", desc: "Personalised multi-phase plans from your current role to your target, with resources and timelines." },
          { icon: "💬", title: "Interview Coach", desc: "Practice with an AI interviewer that gives real-time STAR-method feedback on every answer." },
        ].map((f) => (
          <div key={f.title} className="card group hover:border-ember-500/20 transition-colors duration-300">
            <div className="text-3xl mb-4">{f.icon}</div>
            <h3 className="font-display text-xl text-[#f0ede8] mb-2">{f.title}</h3>
            <p className="text-obsidian-300 text-sm leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </section>
    </main>
  );
}