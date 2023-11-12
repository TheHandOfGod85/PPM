import { Asset } from '@/models/asset'
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetStaticPaths,
  GetStaticProps,
} from 'next'
import * as AssetApi from '@/network/api/asset.api'
import Link from 'next/link'
import AssetsEntry from '@/components/AssetsEntry'
import GoBackButton from '@/components/GoBackButton'
import Image from 'next/image'

export const getServerSideProps: GetServerSideProps<AssetSingleProps> = async (
  context: GetServerSidePropsContext
) => {
  const { cookie } = context.req.headers
  const assetId = context.params?.assetId?.toString()
  if (!assetId) throw Error('Id is missing')
  const asset = await AssetApi.getAsset(assetId, cookie)
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
                    {/* If I want a responsive image
                       I need to wrap the image in a container
                       with these attributes:
                       position: relative;
                       width:100%;
                       max-width700px;
                       aspect-ratio: at your choice;
                    */}
                    <Image
                      src={part.imageUrl || '/images/no-image.jpg'}
                      alt="part image"
                      width={60}
                      height={60}
                      priority
                      className="rounded"
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
