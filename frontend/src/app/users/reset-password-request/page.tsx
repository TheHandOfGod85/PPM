import ResetPasswordRequestForm from '@/ui/auth/ResetPasswordRequestForm'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Request password',
  description: 'Request password page',
}

export default function ResetPasswordRequestPage() {
  return <ResetPasswordRequestForm />
}
