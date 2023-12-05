import SideBar from '@/app/ui/SideBar'
import { ReactNode } from 'react'
import ProtectedRoute from '../ui/auth/ProtectedRoute'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <ProtectedRoute>
        <SideBar>{children}</SideBar>
      </ProtectedRoute>
    </>
  )
}
