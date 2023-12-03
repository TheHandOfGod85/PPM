'use client'
import { logout } from '@/app/lib/data/user.data'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'
import {
  FaAlignJustify,
  FaHome,
  FaQuestion,
  FaTools,
  FaUserFriends,
} from 'react-icons/fa'
import { FaArrowRightFromBracket } from 'react-icons/fa6'
interface NavBarProps {
  children: ReactNode
}

export default function SideBar({ children }: NavBarProps) {
  const pathname = usePathname()
  const { data: session } = useSession()

  const onLogout = async () => {
    try {
      await logout()
      signOut({
        redirect: true,
        callbackUrl: '/',
      })
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <>
      <div className="drawer lg:drawer-open">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          <label
            htmlFor="my-drawer-2"
            className="btn btn-ghost btn-lg drawer-button lg:hidden relative left-0"
          >
            <FaAlignJustify size={30} />
          </label>
          {/* Page content here */}
          <main className="lg:mt-4">{children}</main>
        </div>
        <div className="drawer-side">
          <label
            htmlFor="my-drawer-2"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu p-4 w-60 min-h-full bg-base-200 text-base-content font-semibold text-lg gap-2">
            {/* Sidebar content here */}

            {session?.user && (
              <h1 className="font-bold text-secondary">
                Hello, {session?.user.displayName}
              </h1>
            )}

            <li>
              <Link
                href={'/dashboard'}
                className={pathname == '/dashboard' ? 'active' : ''}
              >
                <FaHome /> Home
              </Link>
            </li>
            {session?.user?.role === 'admin' && (
              <li>
                <Link
                  href={'/dashboard/users'}
                  className={pathname == '/dshboard/users' ? 'active' : ''}
                >
                  <FaUserFriends /> Users
                </Link>
              </li>
            )}

            <div className="dropdown dropdown-hover">
              <label tabIndex={0} className="btn text-[1.1rem] normal-case">
                <FaTools /> Asset
              </label>
              <ul
                tabIndex={0}
                className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
              >
                <li>
                  <Link
                    href={'/dashboard/assets'}
                    className={pathname == '/dashboard/assets' ? 'active' : ''}
                  >
                    Assets List
                  </Link>
                </li>
                {session?.user?.role === 'admin' && (
                  <li>
                    <Link
                      href={'/dashboard/assets/new-asset'}
                      className={
                        pathname == '/dashboard/assets/new-asset'
                          ? 'active'
                          : ''
                      }
                    >
                      New Asset
                    </Link>
                  </li>
                )}
              </ul>
            </div>
            <li className="absolute bottom-0 mb-4">
              <Link
                href={'/dashboard/about'}
                className={pathname == '/dashboard/about' ? 'active' : ''}
              >
                <FaQuestion /> About
              </Link>
            </li>
            <li className="absolute bottom-8 mb-4">
              <button type="button" onClick={onLogout}>
                <FaArrowRightFromBracket /> Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </>
  )
}
