"use client"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { type ProjectSummary } from "@/lib/data/projects"

type DialogState =
  | null
  | { type: "create" }
  | { type: "rename"; project: ProjectSummary }
  | { type: "delete"; project: ProjectSummary }

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

function uniqueSuffix(): string {
  return Math.random().toString(36).slice(2, 8)
}

export function useProjectActions() {
  const router = useRouter()
  const pathname = usePathname()
  const [dialog, setDialog] = useState<DialogState>(null)
  const [name, setName] = useState("")
  const [createSuffix, setCreateSuffix] = useState("")
  const [loading, setLoading] = useState(false)

  const slug = toSlug(name)
  const roomId = slug ? `${slug}-${createSuffix}` : createSuffix

  function openCreate() {
    setName("")
    setCreateSuffix(uniqueSuffix())
    setDialog({ type: "create" })
  }

  function openRename(project: ProjectSummary) {
    setName(project.name)
    setDialog({ type: "rename", project })
  }

  function openDelete(project: ProjectSummary) {
    setDialog({ type: "delete", project })
  }

  function close() {
    setDialog(null)
  }

  async function submit() {
    if (!dialog) return
    setLoading(true)
    try {
      if (dialog.type === "create") {
        const res = await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, id: roomId }),
        })
        if (!res.ok) {
          const text = await res.text()
          throw new Error(`Create failed: ${res.status} ${res.statusText}${text ? ` - ${text}` : ""}`)
        }
        const project = await res.json()
        close()
        router.push(`/editor/${project.id}`)
      } else if (dialog.type === "rename") {
        const res = await fetch(`/api/projects/${dialog.project.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name }),
        })
        if (!res.ok) {
          const text = await res.text()
          throw new Error(`Rename failed: ${res.status} ${res.statusText}${text ? ` - ${text}` : ""}`)
        }
        close()
        router.refresh()
      } else if (dialog.type === "delete") {
        const res = await fetch(`/api/projects/${dialog.project.id}`, {
          method: "DELETE",
        })
        if (!res.ok) {
          const text = await res.text()
          throw new Error(`Delete failed: ${res.status} ${res.statusText}${text ? ` - ${text}` : ""}`)
        }
        close()
        if (pathname === `/editor/${dialog.project.id}`) {
          router.push("/editor")
        } else {
          router.refresh()
        }
      }
    } catch (error) {
      console.error("Project action failed", error)
      if (typeof window !== "undefined") {
        window.alert(error instanceof Error ? error.message : "Project action failed")
      }
    } finally {
      setLoading(false)
    }
  }

  return {
    dialog,
    name,
    setName,
    loading,
    openCreate,
    openRename,
    openDelete,
    close,
    submit,
    roomId: dialog?.type === "create" ? roomId : undefined,
  }
}
