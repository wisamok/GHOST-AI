"use client"

import { useState } from "react"
import { type MockProject } from "@/lib/mock-projects"

type DialogState =
  | null
  | { type: "create" }
  | { type: "rename"; project: MockProject }
  | { type: "delete"; project: MockProject }

export function useProjectDialogs() {
  const [dialog, setDialog] = useState<DialogState>(null)
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)

  function openCreate() {
    setName("")
    setDialog({ type: "create" })
  }

  function openRename(project: MockProject) {
    setName(project.name)
    setDialog({ type: "rename", project })
  }

  function openDelete(project: MockProject) {
    setDialog({ type: "delete", project })
  }

  function close() {
    setDialog(null)
  }

  async function submit() {
    setLoading(true)
    await new Promise<void>((r) => setTimeout(r, 600))
    setLoading(false)
    close()
  }

  return { dialog, name, setName, loading, openCreate, openRename, openDelete, close, submit }
}
