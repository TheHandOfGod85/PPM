import { Metadata } from 'next'
import Login from './ui/auth/Login'
import { isLoggedIn } from './lib/data/user.data'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Login',
  description: 'login page',
}

export default async function Homepage() {
  const loggedIn = await isLoggedIn()
  console.log(loggedIn)
  if (loggedIn) {
    redirect('/dashboard')
  } else {
    return <Login />
  }
}
