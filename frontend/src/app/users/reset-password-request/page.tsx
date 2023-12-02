import ResetPasswordRequestForm from '@/app/ui/auth/ResetPasswordRequestForm'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Request password',
  description: 'Request password page',
}

export default async function ResetPasswordRequestPage() {
  return <ResetPasswordRequestForm />
}
