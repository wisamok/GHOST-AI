import { auth, clerkClient } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { getProjectAccess } from '@/lib/project-access'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { userId } = await auth()
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { projectId } = await params
  const project = await getProjectAccess(projectId)
  if (!project) return Response.json({ error: 'Not found' }, { status: 404 })

  const rows = await prisma.projectCollaborator.findMany({
    where: { projectId },
    orderBy: { createdAt: 'asc' },
    select: { email: true },
  })

  const emails = rows.map((r) => r.email)

  type Person = { email: string | null; name: string | null; imageUrl: string | null }

  let owner: Person = { email: null, name: null, imageUrl: null }
  let collaborators: Array<{ email: string; name: string | null; imageUrl: string | null }> = emails.map(
    (email) => ({ email, name: null, imageUrl: null })
  )

  try {
    const clerk = await clerkClient()

    // Enrich owner
    const ownerUser = await clerk.users.getUser(project.ownerId)
    owner = {
      name: [ownerUser.firstName, ownerUser.lastName].filter(Boolean).join(' ') || null,
      email:
        ownerUser.emailAddresses.find((e) => e.id === ownerUser.primaryEmailAddressId)
          ?.emailAddress ?? null,
      imageUrl: ownerUser.imageUrl ?? null,
    }

    // Enrich collaborators
    if (emails.length > 0) {
      const { data: users } = await clerk.users.getUserList({ emailAddress: emails })
      const userMap = new Map(
        users.flatMap((u) => u.emailAddresses.map((ea) => [ea.emailAddress, u]))
      )
      collaborators = emails.map((email) => {
        const user = userMap.get(email)
        return {
          email,
          name: user
            ? [user.firstName, user.lastName].filter(Boolean).join(' ') || null
            : null,
          imageUrl: user?.imageUrl ?? null,
        }
      })
    }
  } catch {
    // Clerk enrichment failed — return emails only
  }

  return Response.json({ owner, collaborators })
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { userId } = await auth()
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { projectId } = await params
  const project = await prisma.project.findUnique({ where: { id: projectId } })
  if (!project) return Response.json({ error: 'Not found' }, { status: 404 })
  if (project.ownerId !== userId) return Response.json({ error: 'Forbidden' }, { status: 403 })

  const body = await request.json().catch(() => ({}))
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  if (!email) return Response.json({ error: 'email is required' }, { status: 400 })

  await prisma.projectCollaborator.upsert({
    where: { projectId_email: { projectId, email } },
    create: { projectId, email },
    update: {},
  })

  return Response.json({ ok: true }, { status: 201 })
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { userId } = await auth()
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { projectId } = await params
  const project = await prisma.project.findUnique({ where: { id: projectId } })
  if (!project) return Response.json({ error: 'Not found' }, { status: 404 })
  if (project.ownerId !== userId) return Response.json({ error: 'Forbidden' }, { status: 403 })

  const body = await request.json().catch(() => ({}))
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  if (!email) return Response.json({ error: 'email is required' }, { status: 400 })

  await prisma.projectCollaborator.deleteMany({ where: { projectId, email } })

  return new Response(null, { status: 204 })
}
