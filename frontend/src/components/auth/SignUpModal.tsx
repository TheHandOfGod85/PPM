import useAuthenticatedUser from '@/hooks/useAuthenticatedUser'
import * as UsersApi from '@/network/api/user.api'
import { BadRequestError, ConflictError } from '@/network/http-errors'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import LoadingButton from '../LoadingButton'
import FormInputField from '../form/FormInputField'
import PasswordInputField from '../form/PasswordInputField'
import SelectInputField from '../form/SelectInputField'

const roles = ['admin', 'user']

interface SignUpFomrData {
  username: string
  email: string
  password: string
  role?: string
}
export default function SignUpModal() {
  const modal = document.getElementById('signup_modal') as HTMLFormElement
  const resetDialog = () => {
    setErrorText(null)
  }
  const { mutateUser } = useAuthenticatedUser()
  const [errorText, setErrorText] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFomrData>()
  async function onSubmit(credentials: SignUpFomrData) {
    try {
      setErrorText(null)
      const newUser = await UsersApi.SignUp(credentials)
      mutateUser(newUser)
      if (modal) {
        modal.close()
      }
      reset()
    } catch (error) {
      if (error instanceof ConflictError || error instanceof BadRequestError) {
        setErrorText(error.message)
      } else {
        console.error(error)
        alert(error)
      }
    }
  }
  return (
    <dialog id="signup_modal" className="modal modal-bottom sm:modal-middle">
      <div className="modal-box">
        <div className="modal-action">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button
              onClick={resetDialog}
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            >
              ✕
            </button>
          </form>
        </div>
        <h3 className="font-bold text-lg">New user registration</h3>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="join join-vertical w-full gap-3 mt-2 p-4">
            <FormInputField
              register={register('username')}
              placeholder="Username"
              error={errors.username}
            />
            <FormInputField
              register={register('email')}
              placeholder="Email"
              error={errors.email}
              type="email"
            />
            <SelectInputField
              register={register('role')}
              option={roles}
              optionTitle="Role to assign?"
              placeholder="Role"
              error={errors.role}
            />
            <PasswordInputField
              register={register('password')}
              placeholder="Password"
              type="password"
              error={errors.password}
            />
            <LoadingButton type="submit" isLoading={isSubmitting}>
              Create user
            </LoadingButton>
            {errorText && (
              <div className="alert alert-error mt-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-current shrink-0 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{errorText}</span>
              </div>
            )}
          </div>
        </form>
      </div>
    </dialog>
  )
}
