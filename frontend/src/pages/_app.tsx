/* eslint-disable react/no-children-prop */
import SideBar from '@/components/SideBar'
import useAuthenticatedUser from '@/hooks/useAuthenticatedUser'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import NextNProgress from 'nextjs-progressbar'
import Home from '.'
import LoadingSpinner from '@/components/LoadingSpinner'
import { useRouter } from 'next/router'
import SignUp from './users/[userId]/signup/[verificationCode]/index'

export default function App({ Component, pageProps }: AppProps) {
  const { user, userLoading } = useAuthenticatedUser()
  const router = useRouter()

  const renderContent = userLoading ? (
    <LoadingSpinner />
  ) : user === null &&
    router.pathname === `/users/[userId]/signup/[verificationCode]` ? (
    <SignUp />
  ) : user === null ? (
    <Home />
  ) : (
    <SideBar>
      <Component {...pageProps} />
    </SideBar>
  )

  return (
    <>
      <NextNProgress color="#37cdbe" />
      {renderContent}
    </>
  )
}
