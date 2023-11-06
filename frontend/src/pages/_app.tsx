/* eslint-disable react/no-children-prop */
import SideBar from '@/components/SideBar'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import NextNProgress from 'nextjs-progressbar'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <NextNProgress color='#37cdbe'/>
      <SideBar children={<Component {...pageProps} />} />
    </>
  )
}
