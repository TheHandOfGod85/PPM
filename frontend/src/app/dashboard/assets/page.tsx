import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import * as AssetApi from '@/app/lib/data/assets.data'
import AssetsEntry from '@/app/ui/assets/AssetsEntry'
import AssetsPaginationBar from '@/app/ui/assets/AssetsPaginationBar'
import Navbar from '@/app/ui/assets/Navbar'
import { getCookie } from '@/utils/utilsAppRouter'
import { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { stringify } from 'querystring'

export const metadata: Metadata = {
  title: 'Assets',
  description: 'assets page',
}

interface AssetPageProps {
  searchParams: {
    page?: string
    search: string
  }
}

export default async function AssetPage({ searchParams }: AssetPageProps) {
  const session = await getServerSession(authOptions)
  const user = session?.user

  const pageParam = parseInt(searchParams.page?.toString() || '1')
  const filter = searchParams.search

  if (pageParam < 1) {
    searchParams.page = '1'
    redirect('/dashboard/assets?' + stringify(searchParams))
  }
  const data = await AssetApi.getAssets(pageParam, filter, user?.cookie)
  const { page, totalPages } = data
  if (totalPages > 0 && page > totalPages) {
    searchParams.page = totalPages.toString()
    redirect('/dashboard/assets?' + stringify(searchParams))
  }

  return (
    <>
      <div className="container mx-auto px-2">
        <h1 className="title">Assets</h1>
        <Navbar user={user} />
        {data.assets.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2  lg:grid-cols-2 xl:grid-cols-3 gap-4 mx-auto">
            {data.assets.map((asset) => (
              <AssetsEntry key={asset._id} asset={asset} user={user} />
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
