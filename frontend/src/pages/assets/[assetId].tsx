import { Asset } from '@/models/asset'
import { GetStaticPaths, GetStaticProps } from 'next'
import * as AssetApi from '@/network/api/asset.api'
import Link from 'next/link'
import AssetsEntry from '@/components/AssetsEntry'
import GoBackButton from '@/components/GoBackButton'
import Image from 'next/image'
import { useState } from 'react'

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
        <div className="overflow-x-auto mt-9 mb-3">
          <table className="table tab-md">
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Part Number</th>
                <th>Manufacturer</th>
                <th>Image</th>
              </tr>
            </thead>
            <tbody>
              {asset.parts.map((part) => (
                <tr key={part._id}>
                  <td className="whitespace-nowrap">{part.name}</td>
                  <td>
                    <div className="collapse collapse-arrow">
                      <input type="checkbox" />
                      <div className="collapse-title whitespace-nowrap">
                        Click to open
                      </div>
                      <div className="collapse-content">
                        <p className="text-accent">{part.description}</p>
                      </div>
                    </div>
                  </td>
                  <td>{part.partNumber}</td>
                  <td>{part.manufacturer}</td>
                  <td>
                    <Image
                      src={part.imageUrl || '/images/no-image.jpg'}
                      alt="part image"
                      width={60}
                      height={60}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <GoBackButton href="/assets" />
      </div>
    </>
  )
}
