import EditAssetForm from '@/app/ui/assets/EditAssetForm'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Edit Asset',
  description: 'Edit Asset page',
}

interface EditAssetPageProps {
  params: {
    assetId: string
  }
}
export default async function EditAssetPage({ params }: EditAssetPageProps) {
  const assetId = params.assetId
  if (!assetId) throw Error('Asset id missing')

  return <EditAssetForm assetId={assetId} />
}
