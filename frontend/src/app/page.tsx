import { Metadata } from 'next'
import Login from './ui/auth/Login'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Login',
  description: 'login page',
}

export default async function Homepage() {
  const session = await getServerSession()
  const user = session?.user
  if (user) {
    redirect('/dashboard')
  } else {
    return <Login />
  }
}
