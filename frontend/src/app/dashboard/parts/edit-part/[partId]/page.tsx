import * as PartApi from '@/lib/data/part.data'
import EditPartForm from '@/app/ui/parts/EditPartForm'
import { cookies } from 'next/headers'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Edit part ',
  description: 'Edit part page',
}

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
