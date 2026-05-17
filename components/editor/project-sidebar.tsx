"use client"

import { X, Plus, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { type ProjectSummary } from "@/lib/data/projects"

interface ProjectSidebarProps {
  isOpen: boolean
  onClose: () => void
  onNewProject: () => void
  ownedProjects: ProjectSummary[]
  sharedProjects: ProjectSummary[]
  onRenameProject: (project: ProjectSummary) => void
  onDeleteProject: (project: ProjectSummary) => void
}

export function ProjectSidebar({
  isOpen,
  onClose,
  onNewProject,
  ownedProjects,
  sharedProjects,
  onRenameProject,
  onDeleteProject,
}: ProjectSidebarProps) {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r transition-transform duration-200 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
        style={{
          backgroundColor: "var(--bg-surface)",
          borderColor: "var(--border-default)",
        }}
      >
        <div
          className="flex items-center justify-between border-b px-4 py-3"
          style={{ borderColor: "var(--border-default)" }}
        >
          <span
            className="text-sm font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            Projects
          </span>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close sidebar">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-1 flex-col overflow-hidden">
          <Tabs defaultValue="my-projects" className="flex h-full flex-col">
            <TabsList className="mx-3 mt-3 w-[calc(100%-1.5rem)]">
              <TabsTrigger value="my-projects" className="flex-1">
                My Projects
              </TabsTrigger>
              <TabsTrigger value="shared" className="flex-1">
                Shared
              </TabsTrigger>
            </TabsList>

            <TabsContent value="my-projects" className="flex-1 overflow-y-auto px-2 py-2">
              {ownedProjects.length === 0 ? (
                <div className="flex h-full items-center justify-center px-4">
                  <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                    No projects yet.
                  </p>
                </div>
              ) : (
                <ul className="flex flex-col gap-0.5">
                  {ownedProjects.map((project) => (
                    <ProjectItem
                      key={project.id}
                      project={project}
                      isOwned
                      onRename={onRenameProject}
                      onDelete={onDeleteProject}
                    />
                  ))}
                </ul>
              )}
            </TabsContent>

            <TabsContent value="shared" className="flex-1 overflow-y-auto px-2 py-2">
              {sharedProjects.length === 0 ? (
                <div className="flex h-full items-center justify-center px-4">
                  <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                    No shared projects.
                  </p>
                </div>
              ) : (
                <ul className="flex flex-col gap-0.5">
                  {sharedProjects.map((project) => (
                    <ProjectItem
                      key={project.id}
                      project={project}
                      isOwned={false}
                      onRename={onRenameProject}
                      onDelete={onDeleteProject}
                    />
                  ))}
                </ul>
              )}
            </TabsContent>
          </Tabs>
        </div>

        <div
          className="border-t p-3"
          style={{ borderColor: "var(--border-default)" }}
        >
          <Button
            variant="outline"
            className="w-full gap-2"
            onClick={onNewProject}
            style={{
              backgroundColor: "var(--accent-primary)",
              borderColor: "var(--accent-primary)",
              color: "#000000",
            }}
          >
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </div>
      </aside>
    </>
  )
}

interface ProjectItemProps {
  project: ProjectSummary
  isOwned: boolean
  onRename: (project: ProjectSummary) => void
  onDelete: (project: ProjectSummary) => void
}

function ProjectItem({ project, isOwned, onRename, onDelete }: ProjectItemProps) {
  return (
    <li className="group flex items-center gap-1 rounded-lg px-2 py-1.5 hover:bg-[var(--bg-subtle)]">
      <span
        className="flex-1 truncate text-sm"
        style={{ color: "var(--text-primary)" }}
      >
        {project.name}
      </span>
      {isOwned && (
        <div className="flex items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onRename(project)}
            aria-label={`Rename ${project.name}`}
          >
            <Pencil className="h-3.5 w-3.5" style={{ color: "var(--text-muted)" }} />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onDelete(project)}
            aria-label={`Delete ${project.name}`}
          >
            <Trash2 className="h-3.5 w-3.5" style={{ color: "var(--text-muted)" }} />
          </Button>
        </div>
      )}
    </li>
  )
}
