"use client"

import { useState } from "react"
import { EditorNavbar } from "@/components/editor/editor-navbar"
import { ProjectSidebar } from "@/components/editor/project-sidebar"

export default function EditorPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--bg-base)" }}>
      <EditorNavbar isOpen={sidebarOpen} onToggle={() => setSidebarOpen((v) => !v)} />
      <ProjectSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="pt-12">
        {/* Editor canvas placeholder */}
      </main>
    </div>
  )
}
