import ResetPasswordForm from '@/ui/auth/ResetPasswordForm'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Reset password',
  description: 'Reset password page',
}

interface ResetPasswordPageProps {
  params: {
    verificationCode: string
  }
}

export default function ResetPasswordPage({ params }: ResetPasswordPageProps) {
  const verificationCode = params.verificationCode

  return <ResetPasswordForm verificationCode={verificationCode} />
}
