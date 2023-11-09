import Link from 'next/link'
import React, { ReactNode } from 'react'
import {
  FaAlignJustify,
  FaHome,
  FaQuestion,
  FaTools,
  FaUserFriends,
} from 'react-icons/fa'
import { useRouter } from 'next/router'
interface NavBarProps {
  children: ReactNode
}
export default function SideBar({ children }: NavBarProps) {
  const router = useRouter()
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
            <li>
              <Link
                href={'/'}
                className={router.pathname == '/' ? 'active' : ''}
              >
                <FaHome /> Home
              </Link>
            </li>
            <li>
              <Link
                href={'/users'}
                className={router.pathname == '/users' ? 'active' : ''}
              >
                <FaUserFriends /> Users
              </Link>
            </li>

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
                    href={'/assets'}
                    className={router.pathname == '/assets' ? 'active' : ''}
                  >
                    Assets List
                  </Link>
                </li>
                <li>
                  <Link
                    href={'/assets/new-asset'}
                    className={
                      router.pathname == '/assets/new-asset' ? 'active' : ''
                    }
                  >
                    New Asset
                  </Link>
                </li>
              </ul>
            </div>
            <li className="absolute bottom-0 mb-4">
              <Link
                href={'/about'}
                className={router.pathname == '/about' ? 'active' : ''}
              >
                <FaQuestion /> About
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  )
}
