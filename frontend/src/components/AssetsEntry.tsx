import { Asset } from '@/models/asset'
import React from 'react'
interface AssetsEntryProps {
  asset: Asset
}

export default function AssetsEntry({
  asset: { name, description, createdAt, serialNumber },
}: AssetsEntryProps) {
  return (
    <div className="card bg-gray-700 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">{name}</h2>
        <p>{description}</p>
      </div>
    </div>
  )
}
