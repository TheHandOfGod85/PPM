import PopUpConfirm from '@/components/PopUpConfirm'
import SignUpModal from '@/components/auth/SignUpModal'
import { useUser } from '@/contexts/AuthProvider'
import { User } from '@/models/user'
import * as UserApi from '@/network/api/user.api'
import { UnauthorisedError } from '@/network/http-errors'
import { formatDate, openModal } from '@/utils/utils'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { FaTrash, FaUser } from 'react-icons/fa'
import { useMediaQuery } from 'react-responsive'

export const getServerSideProps: GetServerSideProps<UsersPageProps> = async (
  context: GetServerSidePropsContext
) => {
  try {
    const { cookie } = context.req.headers
    const users = await UserApi.getAllUsers(cookie)
    return { props: { users } }
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
  const { user } = useUser()
  const isMobile = useMediaQuery({ maxWidth: 640 })
  const [deleteUserId, setDeleteUserId] = useState('')
  const router = useRouter()

  async function onDeleteUser(userId: string) {
    try {
      await UserApi.removeUser(userId)
      router.replace(router.asPath)
    } catch (error) {
      console.error(error)
      alert(error)
    }
  }
  const generateButtons = (userId: string) => {
    if (user?.role === 'admin' && user._id !== userId) {
      if (isMobile) {
        return (
          <div className="flex gap-1">
            <button
              className="btn btn-warning btn-xs"
              onClick={() => {
                setDeleteUserId(userId)
                openModal(`delete_part`)
              }}
            >
              <FaTrash />
            </button>
          </div>
        )
      } else {
        return (
          <div className="flex flex-col gap-1">
            <button
              onClick={() => {
                setDeleteUserId(userId)
                openModal(`remove_user`)
              }}
              className="btn btn-warning btn-sm"
            >
              Delete
            </button>
          </div>
        )
      }
    }
  }

  const calculateDaysRemaining = (createdAt: string) => {
    const expirationDays = 7 // Change this to the desired expiration period
    const createdDate = new Date(createdAt)
    // Add expirationDays to the createdDate
    createdDate.setDate(createdDate.getDate() + expirationDays)
    const currentDate = new Date()
    const timeDifference = createdDate.getTime() - currentDate.getTime()
    const daysRemaining = Math.ceil(timeDifference / (1000 * 3600 * 24))

    return daysRemaining > 0 ? `${daysRemaining} days` : 'Expired'
  }
  return (
    <>
      <Head>
        <title>Users - PPM System</title>
        <meta name="description" content="users page" />
      </Head>
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
                <th>Verified</th>
                <th>Expiring verification</th>
                <th></th>
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
                  <td>{user.verified ? 'Yes' : 'No'}</td>
                  <td>
                    {user.token && user.token.length > 0
                      ? calculateDaysRemaining(user.token[0].createdAt)
                      : 'N/A'}
                  </td>
                  <td>{generateButtons(user._id)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <SignUpModal />
      <PopUpConfirm
        id="remove_user"
        title={'Remove user'}
        infoMessage={'Are you sure you want to delete?'}
        buttonSubmit="Yes"
        button2="No"
        onSubmit={() => onDeleteUser(deleteUserId)}
      />
    </>
  )
}
