import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { EditorHomeClient } from '@/components/editor/editor-home-client'
import { getOwnedProjects, getSharedProjects } from '@/lib/data/projects'

export default async function EditorPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const [ownedProjects, sharedProjects] = await Promise.all([
    getOwnedProjects(),
    getSharedProjects(),
  ])

  return <EditorHomeClient ownedProjects={ownedProjects} sharedProjects={sharedProjects} />
}
