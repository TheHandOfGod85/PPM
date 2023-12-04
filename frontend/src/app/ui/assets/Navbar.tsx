'use client'
import useAuthenticatedUser from '@/hooks/useAuthenticatedUser'
import Link from 'next/link'
import SearchAssets from './SearchAssets'


export default function Navbar() {
  const { user } = useAuthenticatedUser()
  if (user?.role === 'admin') {
    return (
      <div className="flex justify-between items-center mb-3">
        <Link href={'/dashboard/assets/new-asset'}>
          <button className="btn btn-neutral mb-2 btn-sm">new asset</button>
        </Link>
        <SearchAssets />
        <div></div>
      </div>
    )
  } else {
    return (
      <div className="flex justify-center mb-3 items-center">
        <SearchAssets />
      </div>
    )
  }
}
