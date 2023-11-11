/* eslint-disable react/no-children-prop */
import SideBar from '@/components/SideBar'
import useAuthenticatedUser from '@/hooks/useAuthenticatedUser'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import NextNProgress from 'nextjs-progressbar'
import Home from '.'

export default function App({ Component, pageProps }: AppProps) {
  const { user } = useAuthenticatedUser()
  return (
    <>
      <NextNProgress color="#37cdbe" />
      {user ? (
        <SideBar>
          <Component {...pageProps} />
        </SideBar>
      ) : (
        <Home />
      )}
    </>
  )
}
