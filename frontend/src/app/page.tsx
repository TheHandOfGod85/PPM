import Login from '@/ui/auth/Login'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Login',
  description: 'login page',
}

export default async function Homepage() {
  return <Login />
}
