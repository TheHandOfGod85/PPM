import { getAuthenticatedUser } from '@/app/lib/data/user.data'
import GoBackButton from '@/app/ui/GoBackButton'
import AssetsEntry from '@/app/ui/assets/AssetsEntry'
import PartsTable from '@/app/ui/parts/PartsTable'
import SearchParts from '@/app/ui/parts/SearchParts'
import { getCookie } from '@/utils/utilsAppRouter'
import Link from 'next/link'
import * as AssetApi from '@/app/lib/data/assets.data'
import * as PartApi from '@/app/lib/data/part.data'
import PartsPaginationBar from '@/app/ui/parts/PartsPaginationBar'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Asset details',
  description: 'asset detail page',
}

interface AssetDetailsPageProps {
  searchParams: {
    page: string
    search: string
  }
  params: {
    assetId: string
  }
}

export default async function AssetDetailsPage({
  searchParams,
  params,
}: AssetDetailsPageProps) {
  const assetId = params.assetId
  if (!assetId) throw Error('Id is missing')

  const cookie = getCookie()
  const user = await getAuthenticatedUser(cookie)
  const filter = searchParams.search
  const pageParam = parseInt(searchParams.page || '1')

  const getAssetQuery = AssetApi.getAsset(assetId, cookie)
  const getPartsData = PartApi.getPartsByAssetId(
    pageParam,
    assetId,
    filter,
    cookie
  )

  const [asset, data] = await Promise.all([getAssetQuery, getPartsData])
  const { page, parts, totalPages } = data
  return (
    <div className="container mx-auto max-w-[1000px] px-2">
      <h1 className="title">Asset details</h1>
      {user.role === 'admin' && (
        <Link href={`/dashboard/assets/${asset._id}/new-part`}>
          <button className="btn btn-neutral mb-2 btn-sm">new part</button>
        </Link>
      )}

      <AssetsEntry asset={asset} user={user} />
      <div className="overflow-x-auto mt-9 mb-3">
        <div className="flex items-center justify-center my-3">
          <SearchParts id={assetId} />
        </div>
        <PartsTable parts={parts} user={user} />
      </div>
      <div className="flex justify-between">
        <PartsPaginationBar currentPage={page} totalPages={totalPages} />
        <GoBackButton href="/dashboard/assets" />
      </div>
    </div>
  )
}
