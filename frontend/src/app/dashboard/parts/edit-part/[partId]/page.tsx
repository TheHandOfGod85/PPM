import * as PartApi from '@/app/lib/data/part.data'
import EditPartForm from '@/app/ui/parts/EditPartForm'
import { cookies } from 'next/headers'

interface EditPartPageProps {
  params: {
    partId: string
  }
}

export default async function EditPartPage({ params }: EditPartPageProps) {
  const partId = params.partId
  if (!partId) throw Error('Part id missing')

  const part = await PartApi.getPartById(partId, cookies().toString())

  return <EditPartForm part={part} />
}
