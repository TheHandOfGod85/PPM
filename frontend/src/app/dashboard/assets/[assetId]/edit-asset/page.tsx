import * as AssetApi from '@/lib/data/assets.data'
import EditAssetForm from '@/ui/assets/EditAssetForm'
import { cookies } from 'next/headers'

interface EditAssetPageProps {
  params: {
    assetId: string
  }
}
export default async function EditAssetPage({ params }: EditAssetPageProps) {
  const assetId = params.assetId
  if (!assetId) throw Error('Asset id missing')
  const asset = await AssetApi.getAsset(assetId, cookies().toString())

  return <EditAssetForm asset={asset} />
}
