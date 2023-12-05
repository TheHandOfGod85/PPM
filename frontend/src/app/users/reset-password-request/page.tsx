import HideRoute from '@/app/ui/auth/HideRoute'
import ResetPasswordRequestForm from '@/app/ui/auth/ResetPasswordRequestForm'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Request password',
  description: 'Request password page',
}

export default function ResetPasswordRequestPage() {
  return (
    <HideRoute>
      <ResetPasswordRequestForm />
    </HideRoute>
  )
}
