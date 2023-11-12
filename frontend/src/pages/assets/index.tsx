import { Asset } from '@/models/asset'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import Head from 'next/head'
import React from 'react'
import * as AssetApi from '@/network/api/asset.api'
import AssetsEntry from '@/components/AssetsEntry'
import Link from 'next/link'

export const getServerSideProps: GetServerSideProps<AssetPageProps> = async (
  context: GetServerSidePropsContext
) => {
  const { cookie } = context.req.headers
  const assets = await AssetApi.getAssets(cookie)
  return { props: { assets } }
}

interface AssetPageProps {
  assets: Asset[]
}

export default function AssetPage({ assets }: AssetPageProps) {
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mx-auto">
          {assets.map((asset) => (
            <AssetsEntry key={asset._id} asset={asset} />
          ))}
        </div>
      </div>
    </>
  )
}
