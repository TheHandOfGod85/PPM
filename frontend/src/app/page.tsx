import Login from '@/app/ui/auth/Login'
import { Metadata } from 'next'
import HideRoute from './ui/auth/HideRoute'

export const metadata: Metadata = {
  title: 'Login',
  description: 'login page',
}

export default async function Homepage() {
  return (
    <HideRoute>
      <Login />
    </HideRoute>
  )
}
