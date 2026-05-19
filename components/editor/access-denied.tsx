import Link from 'next/link'
import { Lock } from 'lucide-react'

export function AccessDenied() {
  return (
    <div
      className="flex min-h-screen items-center justify-center"
      style={{ backgroundColor: 'var(--bg-base)' }}
    >
      <div className="flex flex-col items-center gap-4 text-center">
        <Lock className="h-10 w-10" style={{ color: 'var(--text-muted)' }} />
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          This project doesn&apos;t exist or you don&apos;t have access.
        </p>
        <Link
          href="/editor"
          className="text-sm transition-opacity hover:opacity-80"
          style={{ color: 'var(--accent-primary)' }}
        >
          Back to editor
        </Link>
      </div>
    </div>
  )
}
