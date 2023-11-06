import { Asset } from '@/models/asset'
import { GetStaticPaths, GetStaticProps } from 'next'
import React from 'react'
import * as AssetApi from '@/network/api/asset.api'
import Link from 'next/link'
import AssetsEntry from '@/components/AssetsEntry'
import GoBackButton from '@/components/GoBackButton'

export const getStaticPaths: GetStaticPaths = async () => {
  const ids = await AssetApi.getAllAssetsIds()
  //here the params must have the same name of the file in the brackets []
  const paths = ids.map((assetId) => ({ params: { assetId } }))
  return {
    paths,
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps<AssetSingleProps> = async ({
  params,
}) => {
  const assetId = params?.assetId?.toString()
  if (!assetId) throw Error('Id is missing')
  const asset = await AssetApi.getAsset(assetId)
  return { props: { asset } }
}

interface AssetSingleProps {
  asset: Asset
}

export default function AssetSingle({ asset }: AssetSingleProps) {
  return (
    <>
      <div className="container mx-auto max-w-[1000px] px-2">
        <h1 className="title">Asset details</h1>
        <Link href={`/assets/${asset._id}/part`}>
          <button className="btn btn-neutral mb-2 btn-sm">new part</button>
        </Link>
        <AssetsEntry asset={asset} />
        <GoBackButton href="/assets" />
      </div>
    </>
  )
}
