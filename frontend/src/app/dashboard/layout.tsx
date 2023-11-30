import { ReactNode } from 'react'
import SideBar from '../ui/SideBar'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <SideBar>{children}</SideBar>
    </>
  )
}
