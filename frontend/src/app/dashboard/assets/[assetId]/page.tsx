import * as AssetApi from '@//lib/data/assets.data'
import * as PartApi from '@/lib/data/part.data'
import GoBackButton from '@/ui/GoBackButton'
import AssetsEntry from '@/ui/assets/AssetsEntry'
import NewPartButton from '@/ui/assets/NewPartButton'
import PartsPaginationBar from '@/ui/parts/PartsPaginationBar'
import PartsTable from '@/ui/parts/PartsTable'
import SearchParts from '@/ui/parts/SearchParts'

import { Metadata } from 'next'
import { cookies } from 'next/headers'

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

  const filter = searchParams.search
  const pageParam = parseInt(searchParams.page || '1')

  const getAssetQuery = AssetApi.getAsset(assetId, cookies().toString())
  const getPartsData = PartApi.getPartsByAssetId(
    pageParam,
    assetId,
    filter,
    cookies().toString()
  )

  const [asset, data] = await Promise.all([getAssetQuery, getPartsData])
  const { page, parts, totalPages } = data
  return (
    <div className="container mx-auto max-w-[1000px] px-2">
      <h1 className="title">Asset details</h1>
      <NewPartButton asset={asset} />

      <AssetsEntry asset={asset} />
      <div className="overflow-x-auto mt-9 mb-3">
        <div className="flex items-center justify-center my-3">
          <SearchParts id={assetId} />
        </div>
        <PartsTable parts={parts} />
      </div>
      <div className="flex justify-between">
        <PartsPaginationBar currentPage={page} totalPages={totalPages} />
        <GoBackButton href="/dashboard/assets" />
      </div>
    </div>
  )
}
