import { getAuthenticatedUser } from '@/app/lib/data/user.data'
import ResetPasswordForm from '@/app/ui/auth/ResetPasswordForm'
import { getCookie } from '@/utils/utilsAppRouter'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Reset password',
  description: 'Reset password page',
}

interface ResetPasswordPageProps {
  searchParams: {
    verificationCode: string
  }
}

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const cookie = getCookie()
  const user = await getAuthenticatedUser()
  const verificationCode = searchParams.verificationCode

  return <ResetPasswordForm user={user} verificationCode={verificationCode} />
}
