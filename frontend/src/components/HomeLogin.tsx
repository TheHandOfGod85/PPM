import React from 'react'
import { FaArrowRightToBracket,FaArrowRightFromBracket } from 'react-icons/fa6'
import LoginModal from './auth/LoginModal'
import useAuthenticatedUser from '@/hooks/useAuthenticatedUser'

export default function HomeLogin() {
  const { user, userError, userLoading, mutateUser } = useAuthenticatedUser()
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
