import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { getProjectAccess } from '@/lib/project-access'
import { getOwnedProjects, getSharedProjects } from '@/lib/data/projects'
import { AccessDenied } from '@/components/editor/access-denied'
import { WorkspaceClient } from '@/components/editor/workspace-client'

export default async function EditorRoomPage(props: { params: Promise<{ roomId: string }> }) {
  const { roomId } = await props.params
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const project = await getProjectAccess(roomId)
  if (!project) return <AccessDenied />

  const [ownedProjects, sharedProjects] = await Promise.all([
    getOwnedProjects(),
    getSharedProjects(),
  ])

  return (
    <WorkspaceClient
      project={{ id: project.id, name: project.name }}
      ownedProjects={ownedProjects}
      sharedProjects={sharedProjects}
      isOwner={project.ownerId === userId}
    />
  )
}
