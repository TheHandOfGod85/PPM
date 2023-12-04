'use client'

import { Asset } from '@/app/lib/models/asset'
import useAuthenticatedUser from '@/hooks/useAuthenticatedUser'
import Link from 'next/link'
interface NewPartButtonProps {
  asset: Asset
}

export default function NewPartButton({ asset }: NewPartButtonProps) {
  const { user } = useAuthenticatedUser()
  if (user?.role === 'admin') {
    return (
      <Link href={`/dashboard/assets/${asset._id}/new-part`}>
        <button className="btn btn-neutral mb-2 btn-sm">new part</button>
      </Link>
    )
  }
}
