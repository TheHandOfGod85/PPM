import { Asset, AssetsPage } from '@/models/asset'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import Head from 'next/head'
import React from 'react'
import * as AssetApi from '@/network/api/asset.api'
import AssetsEntry from '@/components/AssetsEntry'
import Link from 'next/link'
import { stringify } from 'querystring'
import PaginationBar from '@/components/PaginationBar'
import { useRouter } from 'next/router'

export const getServerSideProps: GetServerSideProps<AssetPageProps> = async (
  context: GetServerSidePropsContext
) => {
  const { cookie } = context.req.headers
  const page = parseInt(context.query.page?.toString() || '1')
  if (page < 1) {
    context.query.page = '1'
    return {
      redirect: {
        destination: '/assets?' + stringify(context.query),
        permanent: false,
      },
    }
  }
  const data = await AssetApi.getAssets(cookie, page)

  if (data.totalPages > 0 && page > data.totalPages) {
    context.query.page = data.totalPages.toString()
    return {
      redirect: {
        destination: '/assets?' + stringify(context.query),
        permanent: false,
      },
    }
  }
  return { props: { data } }
}

interface AssetPageProps {
  data: AssetsPage
}

export default function AssetPage({
  data: { assets, page, totalPages },
}: AssetPageProps) {
  const router = useRouter()
  return (
    <>
      <Head>
        <title>Assets - PPM System</title>
        <meta name="description" content="Read all assets" />
      </Head>
      <div className="container mx-auto px-2">
        <h1 className="title">Assets</h1>
        <Link href={'/assets/new-asset'}>
          <button className="btn btn-neutral mb-2 btn-sm">new asset</button>
        </Link>
        {assets.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mx-auto">
            {assets.map((asset) => (
              <AssetsEntry key={asset._id} asset={asset} />
            ))}
          </div>
        )}
        {assets.length === 0 && <p className="title">No assets found</p>}
        {assets.length > 0 && (
          <PaginationBar
            className="my-4"
            currentPage={page}
            pageCount={totalPages}
            onPageItemClicked={(page) => {
              router.push({ query: { ...router.query, page } })
            }}
          />
        )}
      </div>
    </>
  )
}
