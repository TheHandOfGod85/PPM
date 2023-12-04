import SideBar from '@/app/ui/SideBar'
import { ReactNode } from 'react'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <SideBar>{children}</SideBar>
    </>
  )
}
