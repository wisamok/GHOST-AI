import { auth, currentUser } from "@clerk/nextjs/server"
import { getLiveblocks, getUserColor } from "@/lib/liveblocks"
import { getProjectAccess } from "@/lib/project-access"

export async function POST(request: Request) {
  const { userId } = await auth()
  if (!userId) {
    return new Response("Unauthorized", { status: 401 })
  }

  const { room: roomId } = await request.json()

  const project = await getProjectAccess(roomId)
  if (!project) {
    return new Response("Forbidden", { status: 403 })
  }

  const user = await currentUser()
  const name =
    user?.fullName ??
    user?.emailAddresses?.[0]?.emailAddress ??
    "Unknown"
  const avatar = user?.imageUrl ?? ""
  const color = getUserColor(userId)

  const liveblocks = getLiveblocks()

  await liveblocks.getOrCreateRoom(roomId, { defaultAccesses: [] })

  const session = liveblocks.prepareSession(userId, {
    userInfo: { name, avatar, color },
  })
  session.allow(roomId, session.FULL_ACCESS)

  const { status, body } = await session.authorize()
  return new Response(body, { status })
}
