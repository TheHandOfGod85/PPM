import NewPartAssetForm from '@/ui/assets/NewPartAssetForm'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'New part',
  description: 'new part page',
}

interface NewPartAssetFormPageProps {
  params: {
    assetId: string
  }
}

export default async function NewPartAssetPage({
  params,
}: NewPartAssetFormPageProps) {
  const assetId = params.assetId
  if (!assetId) throw Error('Asset Id missing')
  return <NewPartAssetForm assetId={assetId} />
}
