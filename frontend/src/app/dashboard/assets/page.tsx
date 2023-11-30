import * as AssetApi from '@/app/lib/data/assets.data'
import { AssetsPage } from '@/app/lib/models/asset'
import AssetsEntry from '@/app/ui/assets/AssetsEntry'
import AssetsPaginationBar from '@/app/ui/assets/AssetsPaginationBar'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { stringify } from 'querystring'

export const metadata: Metadata = {
  title: 'Assets',
  description: 'assets page',
}

interface AssetPageProps {
  searchParams: {
    page: string
    search: string
  }
}

export default async function AssetPage({ searchParams }: AssetPageProps) {
  const pageParam = parseInt(searchParams.page?.toString() || '1')
  const filter = searchParams.search
  let data: AssetsPage = { assets: [], page: 0, totalPages: 0 }

  if (pageParam < 1) {
    searchParams.page = '1'
    redirect('/assets?' + stringify(searchParams))
  }
  if (filter) {
    data = await AssetApi.getAssets(pageParam, filter)
    const { page, totalPages } = data
    if (totalPages > 0 && page > totalPages) {
      searchParams.page = totalPages.toString()
      redirect('/assets?' + stringify(searchParams))
    }
  }

  return (
    <>
      <div className="container mx-auto px-2">
        <h1 className="title">Assets</h1>
        {/* {navbar()} */}
        {data.assets.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2  lg:grid-cols-2 xl:grid-cols-3 gap-4 mx-auto">
            {data.assets.map((asset) => (
              <AssetsEntry key={asset._id} asset={asset} />
            ))}
          </div>
        )}
        {data.assets.length === 0 && <p className="title">No assets found</p>}
        {data.assets.length > 0 && (
          <AssetsPaginationBar
            currentPage={data.page}
            totalPages={data.totalPages}
          />
        )}
      </div>
    </>
  )
}
