"use client"

import { X, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

interface ProjectSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function ProjectSidebar({ isOpen, onClose }: ProjectSidebarProps) {
  return (
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
        <Tabs defaultValue="my-projects" className="h-full">
          <TabsList className="mx-3 mt-3 w-[calc(100%-1.5rem)]">
            <TabsTrigger value="my-projects" className="flex-1">
              My Projects
            </TabsTrigger>
            <TabsTrigger value="shared" className="flex-1">
              Shared
            </TabsTrigger>
          </TabsList>
          <TabsContent
            value="my-projects"
            className="flex flex-1 items-center justify-center px-4"
          >
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              No projects yet.
            </p>
          </TabsContent>
          <TabsContent
            value="shared"
            className="flex flex-1 items-center justify-center px-4"
          >
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              No shared projects.
            </p>
          </TabsContent>
        </Tabs>
      </div>

      <div
        className="border-t p-3"
        style={{ borderColor: "var(--border-default)" }}
      >
        <Button variant="outline" className="w-full gap-2">
          <Plus className="h-4 w-4" />
          New Project
        </Button>
      </div>
    </aside>
  )
}
