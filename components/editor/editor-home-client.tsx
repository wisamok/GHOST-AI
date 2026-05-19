"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { EditorNavbar } from "@/components/editor/editor-navbar"
import { ProjectSidebar } from "@/components/editor/project-sidebar"
import {
  CreateProjectDialog,
  RenameProjectDialog,
  DeleteProjectDialog,
} from "@/components/editor/project-dialogs"
import { Button } from "@/components/ui/button"
import { useProjectActions } from "@/hooks/use-project-actions"
import { type ProjectSummary } from "@/lib/data/projects"

interface EditorHomeClientProps {
  ownedProjects: ProjectSummary[]
  sharedProjects: ProjectSummary[]
}

export function EditorHomeClient({ ownedProjects, sharedProjects }: EditorHomeClientProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { dialog, name, setName, loading, roomId, openCreate, openRename, openDelete, close, submit } =
    useProjectActions()

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--bg-base)" }}>
      <EditorNavbar isOpen={sidebarOpen} onToggle={() => setSidebarOpen((v) => !v)} />
      <ProjectSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onNewProject={openCreate}
        ownedProjects={ownedProjects}
        sharedProjects={sharedProjects}
        onRenameProject={openRename}
        onDeleteProject={openDelete}
      />

      <main className="flex min-h-screen items-center justify-center pt-12">
        <div className="flex flex-col items-center gap-4 text-center">
          <h1 className="text-xl font-semibold" style={{ color: "var(--text-primary)" }}>
            Create a project or open an existing one
          </h1>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Start a new architecture workspace, or choose a project from the sidebar.
          </p>
          <Button onClick={openCreate} className="gap-2">
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </div>
      </main>

      <CreateProjectDialog
        open={dialog?.type === "create"}
        onOpenChange={(open) => { if (!open) close() }}
        name={name}
        onNameChange={setName}
        roomId={roomId}
        loading={loading}
        onSubmit={submit}
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
