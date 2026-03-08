// src/lib/ai.ts
import Groq from "groq-sdk";

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });
const MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

async function groqJSON<T>(
  system: string,
  user: string,
  maxTokens = 2000
): Promise<T> {
  const response = await client.chat.completions.create({
    model: MODEL,
    max_tokens: maxTokens,
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
    response_format: { type: "json_object" },
  });

  const raw = response.choices[0]?.message?.content || "";

  try {
    return JSON.parse(raw) as T;
  } catch {
    throw new Error(`AI returned malformed JSON: ${raw.slice(0, 100)}`);
  }
}

export interface ResumeAnalysisResult {
  overallScore: number;
  grade: string;
  summary: string;
  sectionScores: {
    impactAndMetrics: number;
    clarityAndFormatting: number;
    atsKeywords: number;
    skillsAlignment: number;
    experienceDepth: number;
  };
  strengths: Array<{ title: string; detail: string }>;
  improvements: Array<{
    priority: "high" | "medium" | "low";
    title: string;
    detail: string;
    example: string | null;
  }>;
  missingKeywords: string[];
  topSkillsDetected: string[];
  atsCompatible: boolean;
  estimatedYearsExperience: number;
}

export interface RoadmapResult {
  title: string;
  overview: string;
  timeline: string;
  phases: Array<{
    phase: number;
    name: string;
    duration: string;
    objective: string;
    keyActions: string[];
    skillsToAcquire: string[];
    milestoneMarker: string;
  }>;
  gapAnalysis: Array<{
    skill: string;
    currentLevel: number;
    requiredLevel: number;
  }>;
  resources: Array<{
    type: string;
    title: string;
    rationale: string;
  }>;
}

export async function analyzeResume(
  resumeText: string,
  targetRole = ""
): Promise<ResumeAnalysisResult> {
  return groqJSON<ResumeAnalysisResult>(
    `You are an expert resume coach. Respond with valid JSON only — no prose, no markdown.`,
    `Analyze this resume${targetRole ? ` for a "${targetRole}" role` : ""}.

RESUME:
${resumeText.slice(0, 12000)}

Return this exact JSON:
{
  "overallScore": <0-100>,
  "grade": <"A+"|"A"|"B+"|"B"|"C"|"D">,
  "summary": "<2-3 sentence summary>",
  "sectionScores": {
    "impactAndMetrics": <0-100>,
    "clarityAndFormatting": <0-100>,
    "atsKeywords": <0-100>,
    "skillsAlignment": <0-100>,
    "experienceDepth": <0-100>
  },
  "strengths": [
    { "title": "<short>", "detail": "<specific observation>" }
  ],
  "improvements": [
    {
      "priority": "high"|"medium"|"low",
      "title": "<short>",
      "detail": "<actionable advice>",
      "example": "<rewritten line or null>"
    }
  ],
  "missingKeywords": ["<keyword>"],
  "topSkillsDetected": ["<skill>"],
  "atsCompatible": true|false,
  "estimatedYearsExperience": <number>
}
Provide exactly 3 strengths and 4 improvements.`,
    2000
  );
}

export async function generateRoadmap(
  currentRole: string,
  targetRole: string,
  yearsTimeline: number,
  resumeText?: string
): Promise<RoadmapResult> {
  return groqJSON<RoadmapResult>(
    `You are a senior career strategist. Respond with valid JSON only — no prose, no markdown.`,
    `Create a career roadmap: "${currentRole}" to "${targetRole}" in ${yearsTimeline} year(s).
${resumeText ? `Resume context:\n${resumeText.slice(0, 3000)}` : ""}

Return this exact JSON:
{
  "title": "<roadmap title>",
  "overview": "<2-sentence overview>",
  "timeline": "<e.g. 18-24 months>",
  "phases": [
    {
      "phase": <1-4>,
      "name": "<phase name>",
      "duration": "<e.g. Months 1-6>",
      "objective": "<1 sentence goal>",
      "keyActions": ["<action>"],
      "skillsToAcquire": ["<skill>"],
      "milestoneMarker": "<success metric>"
    }
  ],
  "gapAnalysis": [
    { "skill": "<name>", "currentLevel": <0-100>, "requiredLevel": <0-100> }
  ],
  "resources": [
    { "type": "book|course|community|tool", "title": "<title>", "rationale": "<why>" }
  ]
}
Provide 3-4 phases, 5 gap skills, 4 resources.`,
    2500
  );
}