"use client"

import { useState, useEffect } from "react"
import { Link2, Check, Mail, Trash2, User } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

interface Person {
  email: string | null
  name: string | null
  imageUrl: string | null
}

interface ShareData {
  owner: Person
  collaborators: Array<{ email: string; name: string | null; imageUrl: string | null }>
}

interface ShareDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectId: string
  isOwner: boolean
}

export function ShareDialog({
  open,
  onOpenChange,
  projectId,
  isOwner,
}: ShareDialogProps) {
  const [data, setData] = useState<ShareData | null>(null)
  const [email, setEmail] = useState("")
  const [inviteLoading, setInviteLoading] = useState(false)
  const [removing, setRemoving] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!open) return
    setData(null)
    fetch(`/api/projects/${projectId}/collaborators`)
      .then((r) => {
        if (!r.ok) {
          throw new Error(`Failed to load collaborators: ${r.status} ${r.statusText}`)
        }
        return r.json()
      })
      .then((d) => setData(d))
      .catch((error) => {
        console.error("Failed to load collaborators", error)
        setData(null)
      })
  }, [open, projectId])

  async function invite() {
    const trimmed = email.trim().toLowerCase()
    if (!trimmed) return
    setInviteLoading(true)
    try {
      const res = await fetch(`/api/projects/${projectId}/collaborators`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      })
      if (!res.ok) {
        const text = await res.text()
        throw new Error(`Invite failed: ${res.status} ${res.statusText}${text ? ` - ${text}` : ""}`)
      }
      const r = await fetch(`/api/projects/${projectId}/collaborators`)
      if (!r.ok) {
        const text = await r.text()
        throw new Error(`Failed to refresh collaborators: ${r.status} ${r.statusText}${text ? ` - ${text}` : ""}`)
      }
      const d = await r.json()
      setData(d)
      setEmail("")
    } catch (error) {
      console.error("Invite failed", error)
      if (typeof window !== "undefined") {
        window.alert(error instanceof Error ? error.message : "Failed to invite collaborator")
      }
    } finally {
      setInviteLoading(false)
    }
  }

  async function remove(targetEmail: string) {
    setRemoving(targetEmail)
    try {
      const res = await fetch(`/api/projects/${projectId}/collaborators`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: targetEmail }),
      })
      if (!res.ok) {
        const text = await res.text()
        throw new Error(`Remove failed: ${res.status} ${res.statusText}${text ? ` - ${text}` : ""}`)
      }
      setData((prev) =>
        prev
          ? { ...prev, collaborators: prev.collaborators.filter((c) => c.email !== targetEmail) }
          : prev
      )
    } catch (error) {
      console.error("Failed to remove collaborator", error)
      if (typeof window !== "undefined") {
        window.alert(error instanceof Error ? error.message : "Failed to remove collaborator")
      }
    } finally {
      setRemoving(null)
    }
  }

  function copyLink() {
    const url = `${window.location.origin}/editor/${projectId}`
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const totalCount = data ? 1 + data.collaborators.length : null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton
        className="data-open:zoom-in-100 data-closed:zoom-out-100"
        style={{ maxWidth: "678px", width: "calc(100vw - 2rem)", maxHeight: "90vh", overflowY: "auto", borderRadius: "20px" }}
      >
        <DialogHeader>
          <DialogTitle>Share project</DialogTitle>
          <DialogDescription>
            Invite collaborators, copy the workspace link, and manage access.
          </DialogDescription>
        </DialogHeader>

        {/* Workspace link card */}
        <div
          className="flex items-center justify-between gap-4 rounded-xl border p-4"
          style={{ backgroundColor: "var(--bg-elevated)", borderColor: "var(--border-default)" }}
        >
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
              Workspace link
            </span>
            <span className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
              Share a direct link with teammates after you grant them access.
            </span>
          </div>
          <button
            onClick={copyLink}
            className="flex shrink-0 items-center gap-2 rounded-lg px-4 py-2 text-xs font-medium"
            style={{
              backgroundColor: "var(--bg-subtle)",
              color: "var(--text-primary)",
              border: "1px solid var(--border-subtle)",
            }}
          >
            {copied ? (
              <Check className="h-3.5 w-3.5" style={{ color: "var(--state-success)" }} />
            ) : (
              <Link2 className="h-3.5 w-3.5" />
            )}
            {copied ? "Copied!" : "Copy link"}
          </button>
        </div>

        {/* Invite row — owner only, bordered card */}
        {isOwner && (
          <div
            className="flex items-center gap-3 rounded-xl border p-3"
            style={{ backgroundColor: "var(--bg-elevated)", borderColor: "var(--border-default)" }}
          >
            <Mail className="h-4 w-4 shrink-0" style={{ color: "var(--text-muted)" }} />
            <Input
              type="email"
              placeholder="teammate@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && email.trim()) invite() }}
              className="flex-1 border-0 bg-transparent p-0 text-sm focus-visible:ring-0"
            />
            <button
              disabled={!email.trim() || inviteLoading}
              onClick={invite}
              className="flex shrink-0 items-center rounded-lg px-4 py-1.5 text-sm font-semibold disabled:opacity-50"
              style={{ backgroundColor: "var(--accent-primary)", color: "#000" }}
            >
              {inviteLoading ? "Inviting…" : "Invite"}
            </button>
          </div>
        )}

        {/* People with access — bordered section */}
        {data && (
          <div
            className="flex flex-col rounded-xl border overflow-hidden"
            style={{ borderColor: "var(--border-default)" }}
          >
            {/* Section header */}
            <div
              className="flex items-center justify-between border-b px-4 py-3"
              style={{ borderColor: "var(--border-default)", backgroundColor: "var(--bg-elevated)" }}
            >
              <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                People with access
              </span>
              {totalCount !== null && (
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                  {totalCount} total
                </span>
              )}
            </div>

            {/* Owner row */}
            {data.owner && (
              <div
                className="flex items-center gap-1 border-b px-4 py-3"
                style={{ borderColor: "var(--border-default)", backgroundColor: "var(--bg-elevated)" }}
              >
                <Avatar person={data.owner} />
                <div className="flex min-w-0 flex-1 flex-col gap-0.5 pl-2">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                      {data.owner.name ?? data.owner.email ?? "Owner"}
                    </span>
                    <Badge variant="owner" />
                  </div>
                  {data.owner.name && data.owner.email && (
                    <span className="truncate text-xs" style={{ color: "var(--text-muted)" }}>
                      {data.owner.email}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Collaborator rows */}
            {data.collaborators.length > 0
              ? data.collaborators.map((c) => (
                <div
                  key={c.email}
                  className="flex items-center gap-1 border-b px-4 py-3 last:border-b-0"
                  style={{ borderColor: "var(--border-default)", backgroundColor: "var(--bg-elevated)" }}
                >
                  <Avatar person={c} />
                  <div className="flex min-w-0 flex-1 flex-col gap-0.5 pl-2">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                        {c.name ?? c.email}
                      </span>
                      <Badge variant="collaborator" />
                    </div>
                    <span className="truncate text-xs" style={{ color: "var(--text-muted)" }}>
                      {c.email}
                    </span>
                  </div>
                  {isOwner && (
                    <button
                      disabled={removing === c.email}
                      onClick={() => remove(c.email)}
                      aria-label={`Remove ${c.email}`}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg disabled:opacity-40"
                    >
                      <Trash2 className="h-4 w-4" style={{ color: "var(--state-error)" }} />
                    </button>
                  )}
                </div>
              ))
              : isOwner && (
                <div
                  className="px-4 py-3"
                  style={{ backgroundColor: "var(--bg-elevated)" }}
                >
                  <p className="text-xs" style={{ color: "var(--text-faint)" }}>
                    No collaborators yet.
                  </p>
                </div>
              )
            }
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

function Avatar({ person }: { person: { name: string | null; email: string | null; imageUrl: string | null } }) {
  if (person.imageUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={person.imageUrl}
        alt=""
        className="shrink-0 rounded-full object-cover"
        style={{ width: "40px", height: "40px", minWidth: "40px", minHeight: "40px" }}
      />
    )
  }
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full"
      style={{ width: "40px", height: "40px", minWidth: "40px", backgroundColor: "rgba(100,87,249,0.25)" }}
    >
      <User className="h-5 w-5" style={{ color: "var(--accent-ai-text)" }} />
    </div>
  )
}

function Badge({ variant }: { variant: "owner" | "collaborator" }) {
  if (variant === "owner") {
    return (
      <span
        className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide"
        style={{
          backgroundColor: "rgba(0,200,212,0.12)",
          color: "var(--accent-primary)",
          border: "1px solid rgba(0,200,212,0.25)",
        }}
      >
        OWNER
      </span>
    )
  }
  return (
    <span
      className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide"
      style={{
        color: "var(--text-muted)",
        border: "1px solid var(--border-default)",
      }}
    >
      COLLABORATOR
    </span>
  )
}
