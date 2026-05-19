import { auth, currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export type ProjectSummary = { id: string; name: string }

export async function getOwnedProjects(): Promise<ProjectSummary[]> {
  const { userId } = await auth()
  if (!userId) return []
  return prisma.project.findMany({
    where: { ownerId: userId },
    orderBy: { createdAt: 'desc' },
    select: { id: true, name: true },
  })
}

export async function getSharedProjects(): Promise<ProjectSummary[]> {
  const user = await currentUser()
  const email = user?.emailAddresses?.[0]?.emailAddress
  if (!email) return []
  const collaborators = await prisma.projectCollaborator.findMany({
    where: { email },
    include: { project: { select: { id: true, name: true } } },
    orderBy: { createdAt: 'desc' },
  })
  return collaborators.map((c) => ({ id: c.project.id, name: c.project.name }))
}
