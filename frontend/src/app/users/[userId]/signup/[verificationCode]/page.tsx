import { getAuthenticatedUser } from '@/app/lib/data/user.data'
import SignupFom from '@/app/ui/auth/SignupFom'
import { getCookie } from '@/utils/utilsAppRouter'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Signup',
  description: 'signup page',
}

interface SignupPageProps {
  searchParams: {
    userId: string
    verificationCode: string
  }
}

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const userId = searchParams.userId
  const verificationCode = searchParams.verificationCode
  return (
    <SignupFom
      userId={userId}
      verificationCode={verificationCode}
    />
  )
}
