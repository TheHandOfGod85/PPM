import ResetPasswordRequestForm from '@/app/ui/auth/ResetPasswordRequestForm'
import { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Request password',
  description: 'Request password page',
}

export default async function ResetPasswordRequestPage() {
  const session = await getServerSession()
  const user = session?.user

  if (user) {
    redirect('/dashboard')
  } else {
    return <ResetPasswordRequestForm />
  }
}
