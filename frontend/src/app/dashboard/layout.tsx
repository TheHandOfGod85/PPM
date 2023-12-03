import { ReactNode } from 'react'
import SideBar from '../ui/SideBar'
import { getCookie } from '@/utils/utilsAppRouter'
import { getAuthenticatedUser } from '../lib/data/user.data'

export default async function Layout({ children }: { children: ReactNode }) {
  const cookie = await getCookie()
  const user = await getAuthenticatedUser(cookie)
  return (
    <>
      <SideBar user={user}>{children}</SideBar>
    </>
  )
}
