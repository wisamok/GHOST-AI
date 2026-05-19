import { SignUp } from "@clerk/nextjs";
import { PenLine, FolderOpen, Users } from "lucide-react";

const features = [
  {
    icon: PenLine,
    title: "AI-powered drafting",
    description: "Describe your idea — Ghost AI turns it into a complete draft instantly.",
  },
  {
    icon: FolderOpen,
    title: "Project organization",
    description: "Keep every piece of writing structured and accessible across projects.",
  },
  {
    icon: Users,
    title: "Real-time collaboration",
    description: "Write with your team. Changes sync instantly across all users.",
  },
];

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen">
      {/* Left panel — hidden on small screens */}
      <div
        className="hidden lg:flex flex-col relative shrink-0 lg:w-1/2"
        style={{
          backgroundColor: "var(--bg-surface)",
          borderRight: "1px solid var(--border-default)",
        }}
      >
        {/* Logo — top left */}
        <div className="absolute top-8 left-8 flex items-center gap-2.5">
          <div
            className="h-8 w-8 shrink-0 rounded-md flex items-center justify-center font-bold text-sm"
            style={{ backgroundColor: "var(--accent-primary)", color: "var(--bg-base)" }}
          >
            G
          </div>
          <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
            Ghost AI
          </span>
        </div>

        {/* Centered copy */}
        <div className="flex flex-1 flex-col justify-center px-16">
          <div className="max-w-md">
            <h1
              className="text-4xl font-bold leading-tight tracking-tight"
              style={{ color: "var(--text-primary)" }}
            >
              Write faster with AI by your side.
            </h1>
            <p className="mt-4 text-base leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              Ghost AI helps you draft, edit, and organize your writing — from first idea to final version.
            </p>

            <ul className="mt-10 space-y-6">
              {features.map(({ icon: Icon, title, description }) => (
                <li key={title} className="flex items-start gap-4">
                  <div
                    className="mt-0.5 h-9 w-9 shrink-0 rounded-md flex items-center justify-center"
                    style={{ backgroundColor: "var(--accent-primary-dim)" }}
                  >
                    <Icon className="h-4 w-4" style={{ color: "var(--accent-primary)" }} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                      {title}
                    </p>
                    <p className="mt-0.5 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                      {description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Right panel — Clerk form */}
      <div
        className="flex flex-1 min-h-screen items-center justify-center"
        style={{ backgroundColor: "var(--bg-base)" }}
      >
        <SignUp />
      </div>
    </div>
  );
}
