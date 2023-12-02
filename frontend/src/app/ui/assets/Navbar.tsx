'use client'
import { User } from '@/app/lib/models/user'
import Link from 'next/link'
import SearchAssets from './SearchAssets'

interface NavbarProps {
  user: User
}
export default function Navbar({ user }: NavbarProps) {
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
