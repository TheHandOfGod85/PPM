/* eslint-disable react/no-children-prop */
import SideBar from '@/components/SideBar'
import useAuthenticatedUser from '@/hooks/useAuthenticatedUser'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import NextNProgress from 'nextjs-progressbar'
import Home from '.'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function App({ Component, pageProps }: AppProps) {
  const { user, userLoading } = useAuthenticatedUser()

  const renderContent = userLoading ? (
    <LoadingSpinner />
  ) : user ? (
    <SideBar>
      <Component {...pageProps} />
    </SideBar>
  ) : (
    <Home />
  )

  return (
    <>
      <NextNProgress color="#37cdbe" />
      {renderContent}
    </>
  )
}
