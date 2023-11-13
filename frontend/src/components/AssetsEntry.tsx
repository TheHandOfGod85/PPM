import { Asset } from '@/models/asset'
import { formatDate } from '@/utils/utils'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
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
  return (
    <div className="card lg:card-side bg-neutral shadow-2xl">
      <div className="card-body">
        {customClasses}
        <h3 className="text-lg text-accent-focus ">
          <span className="font-semibold">Serial Number :</span> {serialNumber}
        </h3>
        <p className="text-sm ">
          <span className="font-semibold">Description: </span>
          <span>{description}</span>
        </p>
        <span className="text-info">{createdUpdatedAt}</span>
      </div>
    </div>
  )
}
