import HomeLogin from '@/components/HomeLogin'
import LoginModal from '@/components/auth/LoginModal'
import { Inter } from 'next/font/google'
import { FaArrowRightToBracket } from 'react-icons/fa6'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return <HomeLogin />
}
