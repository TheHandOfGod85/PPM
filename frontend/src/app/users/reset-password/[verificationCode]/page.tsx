import ResetPasswordForm from '@/app/ui/auth/ResetPasswordForm'
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

export default async function ResetPasswordPage({
  params,
}: ResetPasswordPageProps) {
  const verificationCode = params.verificationCode

  return <ResetPasswordForm verificationCode={verificationCode} />
}
