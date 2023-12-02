import { getAuthenticatedUser } from '@/app/lib/data/user.data'
import { getCookie } from '@/utils/utilsAppRouter'
import * as PartApi from '@/app/lib/data/part.data'
import EditPartForm from '@/app/ui/parts/EditPartForm'

interface EditPartPageProps {
  searchParams: {
    partId: string
  }
}

export default async function EditPartPage({
  searchParams,
}: EditPartPageProps) {
  const partId = searchParams.partId
  if (!partId) throw Error('Part id missing')
  const cookie = getCookie()
  const user = await getAuthenticatedUser(cookie)
  const part = await PartApi.getPartById(partId, cookie)

  return <EditPartForm part={part} user={user} />
}
