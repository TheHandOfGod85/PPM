import ResetPasswordForm from '@/app/ui/auth/ResetPasswordForm'
import { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

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
  const session = await getServerSession()
  const user = session?.user
  const verificationCode = params.verificationCode
  if (user) {
    redirect('/dashboard')
  } else {
    return <ResetPasswordForm verificationCode={verificationCode} />
  }
}
