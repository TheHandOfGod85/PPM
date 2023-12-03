import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import * as PartApi from '@/app/lib/data/part.data'
import { getAuthenticatedUser } from '@/app/lib/data/user.data'
import EditPartForm from '@/app/ui/parts/EditPartForm'
import { getServerSession } from 'next-auth'

interface EditPartPageProps {
  params: {
    partId: string
  }
}

export default async function EditPartPage({ params }: EditPartPageProps) {
  const partId = params.partId
  if (!partId) throw Error('Part id missing')
  const session = await getServerSession(authOptions)
  const cookie = session?.user.cookie
  const user = await getAuthenticatedUser(cookie)
  const part = await PartApi.getPartById(partId, cookie)

  return <EditPartForm part={part} user={user} />
}
