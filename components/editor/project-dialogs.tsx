"use client"

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { type ProjectSummary } from "@/lib/data/projects"

interface CreateProjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  name: string
  onNameChange: (v: string) => void
  roomId: string | undefined
  loading: boolean
  onSubmit: () => void
}

export function CreateProjectDialog({
  open,
  onOpenChange,
  name,
  onNameChange,
  roomId,
  loading,
  onSubmit,
}: CreateProjectDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton>
        <DialogHeader>
          <DialogTitle>Create project</DialogTitle>
          <DialogDescription>
            Give your new architecture workspace a name.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <Input
            placeholder="Project name"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            autoFocus
          />
          <p className="min-h-4 text-xs" style={{ color: "var(--text-muted)" }}>
            {roomId && (
              <>
                room id:{" "}
                <span style={{ color: "var(--text-secondary)" }}>{roomId}</span>
              </>
            )}
          </p>
        </div>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
          <Button disabled={!name.trim() || loading} onClick={onSubmit}>
            {loading ? "Creating…" : "Create project"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

interface RenameProjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  project: ProjectSummary | null
  name: string
  onNameChange: (v: string) => void
  loading: boolean
  onSubmit: () => void
}

export function RenameProjectDialog({
  open,
  onOpenChange,
  project,
  name,
  onNameChange,
  loading,
  onSubmit,
}: RenameProjectDialogProps) {
  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && name.trim()) onSubmit()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton>
        <DialogHeader>
          <DialogTitle>Rename project</DialogTitle>
          {project && (
            <DialogDescription>
              Renaming{" "}
              <strong style={{ color: "var(--text-secondary)" }}>
                {project.name}
              </strong>
              .
            </DialogDescription>
          )}
        </DialogHeader>
        <Input
          placeholder="Project name"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
        />
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
          <Button disabled={!name.trim() || loading} onClick={onSubmit}>
            {loading ? "Saving…" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

interface DeleteProjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  project: ProjectSummary | null
  loading: boolean
  onSubmit: () => void
}

export function DeleteProjectDialog({
  open,
  onOpenChange,
  project,
  loading,
  onSubmit,
}: DeleteProjectDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton>
        <DialogHeader>
          <DialogTitle>Delete project</DialogTitle>
          {project && (
            <DialogDescription>
              <strong style={{ color: "var(--text-secondary)" }}>
                {project.name}
              </strong>{" "}
              will be permanently deleted. This cannot be undone.
            </DialogDescription>
          )}
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
          <Button variant="destructive" disabled={loading} onClick={onSubmit}>
            {loading ? "Deleting…" : "Delete project"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
