import { Inter } from 'next/font/google'
import { ReactNode } from 'react'
import './globals.css'
import Providers from './ui/auth/Providers'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true} className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
