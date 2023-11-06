import { Asset } from '@/models/asset'
import { GetStaticPaths, GetStaticProps } from 'next'
import React from 'react'
import * as AssetApi from '@/network/api/asset.api'

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

export default function AssetSingle({
  asset: { name, description, serialNumber },
}: AssetSingleProps) {
  return <>{JSON.stringify(name)}</>
}
