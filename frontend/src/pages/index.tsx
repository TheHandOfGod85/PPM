import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <button className="btn btn-accent btn-sm">Button</button>
  )
}
