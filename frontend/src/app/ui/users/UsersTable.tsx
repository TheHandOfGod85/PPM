'use client'
import { User } from '@/lib/models/user'
import React, { useState } from 'react'
import * as UsersApi from '@/lib/data/user.data'
import { useMediaQuery } from 'react-responsive'
import { useRouter } from 'next/navigation'
import { formatDate, openModal } from '@/utils/utils'
import { FaTrash, FaUser } from 'react-icons/fa'
import SendRegistrationFormModal from '../auth/SendRegistrationFormModal'
import PopUpConfirm from '../PopUpConfirm'
import useAuthenticatedUser from '@/hooks/useAuthenticatedUser'
import useSWR from 'swr'
import * as UserApi from '@/lib/data/user.data'

export default function UsersTable() {
  const { data: users } = useSWR('get-users', UserApi.getAllUsers)
  const { user } = useAuthenticatedUser()
  const isMobile = useMediaQuery({ maxWidth: 640 })
  const router = useRouter()
  const [deleteUserId, setDeleteUserId] = useState('')

  async function onDeleteUser(userId: string) {
    try {
      await UsersApi.removeUser(userId)
      router.refresh()
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
              {users?.map((user) => (
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
      <SendRegistrationFormModal />
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
