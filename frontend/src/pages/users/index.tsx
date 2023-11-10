import SignUpModal from '@/components/auth/SignUpModal'
import { FaUser } from 'react-icons/fa'

export default function UsersPage() {
  return (
    <>
      <h1 className="title">Users Page</h1>
      <div className="container mx-auto px-2">
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
          <FaUser /> New User
        </button>
      </div>
      <SignUpModal />
    </>
  )
}
