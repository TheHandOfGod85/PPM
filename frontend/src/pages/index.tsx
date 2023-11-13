import LoginModal from '@/components/auth/LoginModal'
import useAuthenticatedUser from '@/hooks/useAuthenticatedUser'
import { Inter } from 'next/font/google'
import { FaArrowRightToBracket } from 'react-icons/fa6'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const { user } = useAuthenticatedUser()
  return (
    <div className="flex h-full flex-col justify-center items-center">
      <h1 className="text-4xl mb-5 font-bold">Home</h1>
      <span className="text-7xl mb-5">🏡</span>
      {!user && (
        <button
          className="btn btn-accent normal-case"
          onClick={() => {
            if (document) {
              ;(
                document.getElementById('signup_modal') as HTMLFormElement
              ).showModal()
            }
          }}
        >
          <FaArrowRightToBracket /> Login
        </button>
      )}

      <LoginModal />
    </div>
  )
}
