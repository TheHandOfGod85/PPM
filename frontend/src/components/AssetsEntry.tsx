import { Asset } from '@/models/asset'
import { formatDate, openModal } from '@/utils/utils'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import { FaEdit, FaTrash } from 'react-icons/fa'
import { useMediaQuery } from 'react-responsive'
import PopUpConfirm from './PopUpConfirm'
import * as AssetApi from '@/network/api/asset.api'
interface AssetsEntryProps {
  asset: Asset
}

export default function AssetsEntry({
  asset: { name, description, createdAt, updatedAt, serialNumber, _id },
}: AssetsEntryProps) {
  const createdUpdatedAt =
    updatedAt > createdAt ? (
      <>
        updated <time dateTime={updatedAt}>{formatDate(updatedAt)}</time>
      </>
    ) : (
      <time dateTime={createdAt}>{formatDate(createdAt)}</time>
    )
  const isMobile = useMediaQuery({ maxWidth: 640 })
  const generateButtons = (assetId: string) => {
    if (isMobile) {
      return (
        <div className="flex gap-1">
          <button
            className="btn btn-warning btn-xs"
            onClick={() => {
              openModal(`asset_delete`)
            }}
          >
            <FaTrash />
          </button>
          <Link
            className="btn btn-info btn-xs"
            href={`/assets/${assetId}/edit-asset`}
          >
            <FaEdit />
          </Link>
        </div>
      )
    } else {
      return (
        <div className="flex gap-1">
          <button
            onClick={() => {
              openModal(`asset_delete`)
            }}
            className="btn btn-warning btn-sm"
          >
            Delete
          </button>
          <Link
            className="btn btn-info btn-sm"
            href={`/assets/${assetId}/edit-asset`}
          >
            Edit
          </Link>
        </div>
      )
    }
  }
  const router = useRouter()
  const customClasses =
    router.pathname === '/assets' ? (
      <Link href={`/assets/${_id}`}>
        <h2 className="card-title text-accent text-2xl font-bold hover:text-accent-focus hover:text-[1.6rem]">
          {name}
        </h2>
      </Link>
    ) : (
      <h2 className="card-title text-accent text-2xl font-bold">{name}</h2>
    )

  async function onDelete(assetId: string) {
    await AssetApi.deleteAsset(assetId)
    router.replace(router.asPath)
  }
  return (
    <>
      <div className="card lg:card-side bg-neutral shadow-2xl">
        <div className="card-body">
          {customClasses}
          <h3 className="text-lg text-accent-focus ">
            <span className="font-semibold">Serial Number :</span>{' '}
            {serialNumber}
          </h3>
          <p className="text-sm ">
            <span className="font-semibold">Description: </span>
            <span>{description}</span>
          </p>
          <span className="text-info">{createdUpdatedAt}</span>
        </div>
        <div className="card-actions justify-end p-4">
          {router.pathname === '/assets' && generateButtons(_id)}
        </div>
      </div>
      <PopUpConfirm
        id="asset_delete"
        title="Delete asset"
        infoMessage={`Are you sure you want to delete asset ${name}, it will delete all the parts too`}
        buttonSubmit="Yes"
        button2="No"
        onSubmit={() => onDelete(_id)}
      />
    </>
  )
}
