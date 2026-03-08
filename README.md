# 🚀 Ascend — AI Career Coach

A full-stack AI-powered career coaching web application built with Next.js, Groq AI, and PostgreSQL. Ascend helps users analyze their resumes, generate personalized career roadmaps, and accelerate their career growth.

🌐 Live Demo : [https://ai-resume-guidence.vercel.app](https://ai-resume-guidence.vercel.app)

---

## ✨ Features

- 📄 **Resume Analysis** — Upload your resume (PDF, DOCX, TXT) and get a detailed AI-powered analysis with ATS scoring, keyword gaps, and actionable suggestions
- 🗺 **Career Roadmap** — Generate a personalized multi-phase career plan from your current role to your target role
- 📊 **Dashboard** — Track your progress with score rings, skill breakdowns, and activity history
- 🔐 **Authentication** — Secure login and signup with encrypted passwords and session management
- ☁️ **Cloud Database** — All data stored securely in PostgreSQL via Neon

---

## 🛠️ Tech Stack

**Languages:** JavaScript, TypeScript, SQL

**Frameworks:** React.js, Next.js 14, Node.js, Tailwind CSS

**Database:** PostgreSQL, Prisma ORM, Neon (Cloud)

**AI & APIs:** Groq API, Llama 3.3 70B

**DevOps:** Git, GitHub, Vercel CI/CD

**Security:** bcryptjs, HTTP-only Cookies, Session Authentication, Zod Validation

**File Processing:** pdf-parse, Mammoth.js

**Other Tools:** npm, VS Code, REST API, Agile Development, SDLC


## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm
- PostgreSQL database (or Neon free tier)
- Groq API key (free at console.groq.com)

## 📁 Project Structure
```
ascend/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── app/
│   │   ├── api/               # Backend API routes
│   │   │   ├── auth/          # Login, register, logout
│   │   │   ├── resume/        # Resume upload & management
│   │   │   ├── analysis/      # AI resume analysis
│   │   │   └── roadmap/       # Career roadmap generation
│   │   ├── auth/              # Login & signup pages
│   │   ├── dashboard/         # Dashboard pages
│   │   └── page.tsx           # Landing page
│   ├── components/
│   │   ├── dashboard/         # Dashboard components
│   │   └── layout/            # Layout components
│   └── lib/
│       ├── ai.ts              # Groq AI integration
│       ├── auth.ts            # Authentication logic
│       ├── extractor.ts       # PDF/DOCX text extraction
│       ├── prisma.ts          # Database connection
│       └── utils.ts           # Helper functions
├── public/
│   └── uploads/               # Uploaded resume files
├── .env                       # Environment variables
├── next.config.js             # Next.js configuration
├── tailwind.config.js         # Tailwind CSS configuration
└── package.json               # Dependencies
```

---

## 🗄️ Database Schema

The app uses **5 main models**:

| Model | Description |
|-------|-------------|
| `User` | Stores user accounts and profiles |
| `Session` | Manages login sessions securely |
| `Resume` | Stores uploaded resume files and text |
| `Analysis` | Stores AI analysis results |
| `Roadmap` | Stores generated career roadmaps |

---

## 🔐 Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string from Neon |
| `NEXTAUTH_SECRET` | Secret key for session encryption |
| `NEXTAUTH_URL` | Your app URL |
| `GROQ_API_KEY` | API key from console.groq.com |
| `GROQ_MODEL` | Groq model name |

---

## 🚀 Deployment

This app is deployed on **Vercel** with **Neon PostgreSQL**.

To deploy your own:
1. Push code to GitHub
2. Import project on vercel.com
3. Add environment variables
4. Deploy!

---

## 👨‍💻 Author

**Rahul Kumar**
- GitHub: [@Rahulkr04122](https://github.com/Rahulkr04122)
- Live App: [https://ai-resume-guidence.vercel.app](https://ai-resume-guidence.vercel.app)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙏 Acknowledgements

- [Groq](https://groq.com) — Ultra fast AI inference
- [Neon](https://neon.tech) — Serverless PostgreSQL
- [Vercel](https://vercel.com) — Seamless deployment
- [Next.js](https://nextjs.org) — The React framework
- [Prisma](https://prisma.io) — Next-generation ORM