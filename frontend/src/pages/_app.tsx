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

  const renderContent = () => {
    if (userLoading) {
      return <LoadingSpinner />
    } else if (
      user === null &&
      router.pathname === `/users/[userId]/signup/[verificationCode]`
    ) {
      return <SignUp />
    } else if (
      user === null &&
      router.pathname === `/users/reset-password-request`
    ) {
      return <RequestPasswordRequest />
    } else if (
      user === null &&
      router.pathname === `/users/reset-password/[verificationCode]`
    ) {
      return <ResetPassword />
    } else if (user === null) {
      return <Home />
    } else {
      return (
        <SideBar>
          <Component {...pageProps} />
        </SideBar>
      )
    }
  }

  return (
    <>
      <NextNProgress color="#37cdbe" />
      {renderContent()}
    </>
  )
}
