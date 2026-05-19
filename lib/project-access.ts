import { auth, currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function getCurrentIdentity() {
  const { userId } = await auth()
  const user = await currentUser()
  const email = user?.emailAddresses?.[0]?.emailAddress ?? null
  return { userId, email }
}

export async function getProjectAccess(roomId: string) {
  const { userId, email } = await getCurrentIdentity()
  if (!userId) return null

  const project = await prisma.project.findUnique({
    where: { id: roomId },
    select: { id: true, name: true, ownerId: true },
  })
  if (!project) return null

  if (project.ownerId === userId) return project

  if (email) {
    const collab = await prisma.projectCollaborator.findUnique({
      where: { projectId_email: { projectId: roomId, email } },
    })
    if (collab) return project
  }

  return null
}
