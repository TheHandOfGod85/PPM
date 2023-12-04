import { Metadata } from 'next'
import Login from './ui/auth/Login'

export const metadata: Metadata = {
  title: 'Login',
  description: 'login page',
}

export default async function Homepage() {
  return <Login />
}
