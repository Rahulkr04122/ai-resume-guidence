// src/components/dashboard/ScoreRing.tsx
"use client";
import { gradeColor } from "@/lib/utils";

export function ScoreRing({
  score,
  grade,
}: {
  score: number;
  grade: string;
}) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative w-36 h-36">
      <svg className="-rotate-90 w-full h-full" viewBox="0 0 120 120">
        <circle
          cx="60" cy="60" r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="10"
        />
        <circle
          cx="60" cy="60" r={radius}
          fill="none"
          stroke="url(#scoreGrad)"
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s ease" }}
        />
        <defs>
          <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f59e28" />
            <stop offset="100%" stopColor="#fcd29a" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-3xl text-ember-400 leading-none">
          {score}
        </span>
        <span className={`font-display text-lg ${gradeColor(grade)}`}>
          {grade}
        </span>
      </div>
    </div>
  );
}