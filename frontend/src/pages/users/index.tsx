import SignUpModal from '@/components/auth/SignUpModal'
import { User } from '@/models/user'
import * as UserApi from '@/network/api/user.api'
import { UnauthorisedError } from '@/network/http-errors'
import { formatDate, openModal } from '@/utils/utils'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { FaUser } from 'react-icons/fa'

export const getServerSideProps: GetServerSideProps<UsersPageProps> = async (
  context: GetServerSidePropsContext
) => {
  try {
    const { cookie } = context.req.headers
    const user = await UserApi.getAuthenticatedUser(cookie)
    if (user.role !== 'admin') {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      }
    }
    const users = await UserApi.getAllUsers(cookie)
    return { props: { users, user } }
  } catch (error) {
    if (error instanceof UnauthorisedError) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      }
    } else {
      throw error
    }
  }
}

interface UsersPageProps {
  users: User[]
}

export default function UsersPage({ users }: UsersPageProps) {
  return (
    <>
      <h1 className="title">Users Page</h1>
      <div className="container mx-auto px-2">
        <button
          className="btn btn-accent normal-case"
          onClick={() => openModal('send_registration_modal')}
        >
          <FaUser /> New User
        </button>
        <div className="overflow-x-auto mt-9 mb-3">
          <table className="table tab-md">
            <thead>
              <tr>
                <th>Email</th>
                <th>Username</th>
                <th>Create At</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="whitespace-nowrap">
                    {user.email ? user.email : 'N/A'}
                  </td>
                  <td>
                    <p className="text-accent">{user.username}</p>
                  </td>
                  <td>{formatDate(user.createdAt)}</td>
                  <td>{user.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <SignUpModal />
    </>
  )
}
