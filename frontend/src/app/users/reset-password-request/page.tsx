import { getAuthenticatedUser } from "@/app/lib/data/user.data"
import { getCookie } from "@/utils/utilsAppRouter"

interface ResetPasswordRequestPageProps {
  searchParams: {
    userId: string
    verificationCode: string
  }
}
export default async function ResetPasswordRequestPage({
  searchParams,
}: ResetPasswordRequestPageProps) {
    const cookie = getCookie()
    const user = await getAuthenticatedUser(cookie)
  return <div>page</div>
}
