import { Asset } from '@/models/asset'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import React from 'react'
import * as AssetApi from '@/network/api/asset.api'
import AssetsEntry from '@/components/AssetsEntry'
import Link from 'next/link'

export const getServerSideProps: GetServerSideProps<
  AssetPageProps
> = async () => {
  const assets = await AssetApi.getAssets()
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
        <h1 className=" text-center text-2xl font-extrabold mb-5">Assets</h1>
        <Link href={'/asset/new-asset'}>
          <button className="btn btn-neutral mb-2 btn-sm text-neutral-content no-underline hover:no-underline hover:text-slate-500">
            new asset
          </button>
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
