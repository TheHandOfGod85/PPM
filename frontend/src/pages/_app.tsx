/* eslint-disable react/no-children-prop */
import SideBar from '@/components/SideBar'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <SideBar children={<Component {...pageProps} />} />
    </>
  )
}
