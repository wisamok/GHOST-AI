"use client"

import { useState } from "react"
import { LayoutDashboard, Share2, Sparkles, Bot, Compass } from "lucide-react"
import { UserButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { ProjectSidebar } from "@/components/editor/project-sidebar"
import {
  RenameProjectDialog,
  DeleteProjectDialog,
} from "@/components/editor/project-dialogs"
import { ShareDialog } from "@/components/editor/share-dialog"
import { useProjectActions } from "@/hooks/use-project-actions"
import { type ProjectSummary } from "@/lib/data/projects"

interface WorkspaceClientProps {
  project: { id: string; name: string }
  ownedProjects: ProjectSummary[]
  sharedProjects: ProjectSummary[]
  isOwner: boolean
}

export function WorkspaceClient({
  project,
  ownedProjects,
  sharedProjects,
  isOwner,
}: WorkspaceClientProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [shareOpen, setShareOpen] = useState(false)
  const { dialog, name, setName, loading, openRename, openDelete, close, submit } =
    useProjectActions()

  return (
    <div
      className="flex h-screen flex-col overflow-hidden"
      style={{ backgroundColor: "var(--bg-base)" }}
    >
      {/* Top navbar */}
      <header
        className="flex h-12 shrink-0 items-center gap-3 border-b px-3"
        style={{
          backgroundColor: "var(--bg-surface)",
          borderColor: "var(--border-default)",
        }}
      >
        <button
          onClick={() => setSidebarOpen((v) => !v)}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md"
          style={{ color: "var(--text-secondary)" }}
          aria-label="Toggle sidebar"
        >
          <LayoutDashboard className="h-4 w-4" />
        </button>

        <div className="flex flex-col leading-tight">
          <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
            {project.name}
          </span>
          <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>
            Workspace
          </span>
        </div>

        <div className="flex-1" />

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 text-xs"
            onClick={() => setShareOpen(true)}
          >
            <Share2 className="h-3.5 w-3.5" />
            Share
          </Button>

          <button
            className="flex h-8 items-center gap-1.5 rounded-md px-3 text-xs font-semibold"
            style={{ backgroundColor: "var(--accent-primary)", color: "#000" }}
          >
            <Sparkles className="h-3.5 w-3.5" />
            AI
          </button>

          <UserButton />
        </div>
      </header>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar */}
        <ProjectSidebar
          variant="inline"
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onNewProject={() => {}}
          ownedProjects={ownedProjects}
          sharedProjects={sharedProjects}
          onRenameProject={openRename}
          onDeleteProject={openDelete}
          activeRoomId={project.id}
        />

        {/* Canvas */}
        <main
          className="relative flex flex-1 items-center justify-center overflow-hidden"
          style={{
            backgroundColor: "var(--bg-base)",
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.055) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        >
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 60% 50% at 50% 55%, rgba(0,200,212,0.07) 0%, transparent 70%)",
            }}
          />

          <div className="relative flex flex-col items-center gap-5 px-8 text-center max-w-lg">
            <div
              className="flex h-16 w-16 items-center justify-center rounded-2xl"
              style={{
                backgroundColor: "var(--bg-elevated)",
                boxShadow:
                  "0 0 0 1px var(--border-default), 0 0 24px rgba(0,200,212,0.15)",
              }}
            >
              <Compass className="h-7 w-7" style={{ color: "var(--accent-primary)" }} />
            </div>

            <p
              className="text-xs tracking-[0.2em] uppercase"
              style={{ color: "var(--text-faint)" }}
            >
              Workspace Shell
            </p>

            <h1
              className="text-2xl font-semibold leading-snug"
              style={{ color: "var(--text-primary)" }}
            >
              Canvas and collaboration tooling land here next.
            </h1>

            <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
              This room is ready for the shared architecture canvas, durable AI workflows, and
              real-time presence. For now, the shell is wired with project context and navigation
              only.
            </p>
          </div>
        </main>

        {/* Right AI Copilot sidebar */}
        <aside
          className="flex w-[310px] shrink-0 flex-col border-l"
          style={{
            backgroundColor: "var(--bg-surface)",
            borderColor: "var(--border-default)",
          }}
        >
          <div
            className="flex items-start justify-between border-b px-4 py-3"
            style={{ borderColor: "var(--border-default)" }}
          >
            <div className="flex flex-col">
              <span
                className="text-sm font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                AI Copilot
              </span>
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                Placeholder panel
              </span>
            </div>
            <button
              className="flex h-7 w-7 items-center justify-center rounded-md"
              aria-label="AI options"
            >
              <Sparkles className="h-4 w-4" style={{ color: "var(--accent-ai-text)" }} />
            </button>
          </div>

          <div className="p-3">
            <div
              className="flex gap-3 rounded-xl border p-4"
              style={{
                backgroundColor: "var(--bg-elevated)",
                borderColor: "var(--border-default)",
              }}
            >
              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                style={{ backgroundColor: "rgba(100,87,249,0.18)" }}
              >
                <Bot className="h-4 w-4" style={{ color: "var(--accent-ai-text)" }} />
              </div>
              <div className="flex flex-col gap-1">
                <span
                  className="text-sm font-semibold"
                  style={{ color: "var(--text-primary)" }}
                >
                  Chat surface pending
                </span>
                <span
                  className="text-xs leading-relaxed"
                  style={{ color: "var(--text-muted)" }}
                >
                  The toggle is wired. Messaging and generation are intentionally out of
                  scope here.
                </span>
              </div>
            </div>
          </div>

          <div className="flex-1" />

          <div
            className="border-t p-4"
            style={{ borderColor: "var(--border-default)" }}
          >
            <p
              className="mb-2 text-[10px] tracking-[0.15em] uppercase"
              style={{ color: "var(--text-faint)" }}
            >
              Future Hooks
            </p>
            <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
              Prompt composer, run status, and architecture guidance will attach to this
              sidebar.
            </p>
          </div>
        </aside>
      </div>

      <ShareDialog
        open={shareOpen}
        onOpenChange={setShareOpen}
        projectId={project.id}
        isOwner={isOwner}
      />
      <RenameProjectDialog
        open={dialog?.type === "rename"}
        onOpenChange={(open) => { if (!open) close() }}
        project={dialog?.type === "rename" ? dialog.project : null}
        name={name}
        onNameChange={setName}
        loading={loading}
        onSubmit={submit}
      />
      <DeleteProjectDialog
        open={dialog?.type === "delete"}
        onOpenChange={(open) => { if (!open) close() }}
        project={dialog?.type === "delete" ? dialog.project : null}
        loading={loading}
        onSubmit={submit}
      />
    </div>
  )
}
