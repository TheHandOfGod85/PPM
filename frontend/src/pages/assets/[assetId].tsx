import AssetsEntry from '@/components/AssetsEntry'
import GoBackButton from '@/components/GoBackButton'
import { Asset } from '@/models/asset'
import * as AssetApi from '@/network/api/asset.api'
import { BadRequestError, NotFoundError } from '@/network/http-errors'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import Link from 'next/link'
import { stringify } from 'querystring'
import * as PartApi from '@/network/api/part.api'
import { getAuthenticatedUser } from '@/network/api/user.api'
import { PartsPage } from '@/models/part'
import PaginationBar from '@/components/PaginationBar'
import { useRouter } from 'next/router'
import SearchParts from '@/components/SearchParts'
import PartsTable from '@/components/parts/PartsTable'
import { User } from '@/models/user'

export const getServerSideProps: GetServerSideProps<AssetSingleProps> = async (
  context: GetServerSidePropsContext
) => {
  try {
    const { cookie } = context.req.headers
    const user = await getAuthenticatedUser(cookie)
    const page = parseInt(context.query.page?.toString() || '1')
    const assetId = context.params?.assetId?.toString()
    if (!assetId) throw Error('Id is missing')

    const filter = context.query.search as string
    if (filter) {
      const getAssetQuery = AssetApi.getAsset(assetId, cookie)
      const getPartsData = PartApi.getPartsByAssetId(
        page,
        assetId,
        filter,
        cookie
      )
      const [asset, data] = await Promise.all([getAssetQuery, getPartsData])
      return { props: { asset, data, assetId, user } }
    } else {
      if (page < 1) {
        context.query.page = '1'
        return {
          redirect: {
            destination: `/assets/${assetId}?` + stringify(context.query),
            permanent: false,
          },
        }
      }
      const getAssetQuery = AssetApi.getAsset(assetId, cookie)
      const getPartsData = PartApi.getPartsByAssetId(
        page,
        assetId,
        filter,
        cookie
      )
      const [asset, data] = await Promise.all([getAssetQuery, getPartsData])

      if (data.totalPages > 0 && page > data.totalPages) {
        context.query.page = data.totalPages.toString()
        return {
          redirect: {
            destination: `/assets/${assetId}?` + stringify(context.query),
            permanent: false,
          },
        }
      }

      return { props: { asset, data, assetId, user } }
    }
  } catch (error) {
    if (error instanceof NotFoundError) {
      return { notFound: true }
    } else if (error instanceof BadRequestError) {
      const referer = '/assets' || '/'
      return {
        redirect: { destination: referer, permanent: false },
      }
    } else {
      throw error
    }
  }
}

interface AssetSingleProps {
  asset: Asset
  data: PartsPage
  assetId: string
  user: User
}

export default function AssetSingle({
  asset,
  data: { page, parts, totalPages },
  assetId,
  user,
}: AssetSingleProps) {
  const router = useRouter()
  return (
    <>
      <div className="container mx-auto max-w-[1000px] px-2">
        <h1 className="title">Asset details</h1>
        {user.role === 'admin' && (
          <Link href={`/assets/${asset._id}/new-part`}>
            <button className="btn btn-neutral mb-2 btn-sm">new part</button>
          </Link>
        )}

        <AssetsEntry asset={asset} />
        <div className="overflow-x-auto mt-9 mb-3">
          <div className="flex items-center justify-center my-3">
            <SearchParts id={assetId} />
          </div>
          <PartsTable parts={parts} />
        </div>
        <div className="flex justify-between">
          <PaginationBar
            currentPage={page}
            pageCount={totalPages}
            onPageItemClicked={(page) => {
              router.push({
                query: { ...router.query, page },
              })
            }}
          />
          <GoBackButton href="/assets" />
        </div>
      </div>
    </>
  )
}
