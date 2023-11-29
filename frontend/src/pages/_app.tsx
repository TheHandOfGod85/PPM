/* eslint-disable react/no-children-prop */
import SideBar from '@/components/SideBar'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import NextNProgress from 'nextjs-progressbar'
import Home from '.'
import LoadingSpinner from '@/components/LoadingSpinner'
import { useRouter } from 'next/router'
import SignUp from './users/[userId]/signup/[verificationCode]/index'
import RequestPasswordRequest from './users/reset-password-request'
import ResetPassword from './users/reset-password/[verificationCode]'
import Head from 'next/head'
import useAuthenticatedUser from '@/hooks/useAuthenticatedUser'
import { UserProvider } from '@/contexts/AuthProvider'
import useLoggedIn from '@/hooks/useLoggedIn'

export default function App({ Component, pageProps }: AppProps) {
  const { userLoading } = useAuthenticatedUser()
  const { data: user } = useLoggedIn()
  const router = useRouter()

  const renderContent = () => {
    if (userLoading) {
      return <LoadingSpinner />
    } else if (
      !user &&
      router.pathname === `/users/[userId]/signup/[verificationCode]`
    ) {
      return <SignUp />
    } else if (!user && router.pathname === `/users/reset-password-request`) {
      return <RequestPasswordRequest />
    } else if (
      !user &&
      router.pathname === `/users/reset-password/[verificationCode]`
    ) {
      return <ResetPassword />
    } else if (!user) {
      return <Home />
    } else {
      return (
        <SideBar>
          <UserProvider>
            <Component {...pageProps} />
          </UserProvider>
        </SideBar>
      )
    }
  }

  return (
    <>
      <Head>
        <link rel="icon" href="/images/favicon.ico" />
      </Head>
      <NextNProgress color="#37cdbe" />
      {renderContent()}
    </>
  )
}
