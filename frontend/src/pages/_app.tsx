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
import RequestPasswordRequest from './users/reset-password-request'
import ResetPassword from './users/reset-password/[verificationCode]'

export default function App({ Component, pageProps }: AppProps) {
  const { user, userLoading } = useAuthenticatedUser()
  const router = useRouter()

  const renderContent = userLoading ? (
    <LoadingSpinner />
  ) : user === null &&
    router.pathname === `/users/[userId]/signup/[verificationCode]` ? (
    <SignUp />
  ) : user === null && router.pathname === `/users/reset-password-request` ? (
    <RequestPasswordRequest />
  ) : user === null &&
    router.pathname === `/users/reset-password/[verificationCode]` ? (
    <ResetPassword />
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
