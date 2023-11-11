import { useForm } from 'react-hook-form'
import * as UsersApi from '@/network/api/user.api'
import FormInputField from '../form/FormInputField'
import PasswordInputField from '../form/PasswordInputField'
import LoadingButton from '../LoadingButton'
import { useState } from 'react'
import { UnathuorizedError } from '@/network/http-errors'
import useAuthenticatedUser from '@/hooks/useAuthenticatedUser'

interface SignUpFomrData {
  username: string
  password: string
}
export default function LoginModal() {
  const { mutateUser } = useAuthenticatedUser()
  const [errorText, setErrorText] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFomrData>()
  async function onSubmit(credentials: SignUpFomrData) {
    try {
      setErrorText(null)
      const user = await UsersApi.login(credentials)
      mutateUser(user)
    } catch (error) {
      if (error instanceof UnathuorizedError) {
        setErrorText('Invalid credentials')
      } else {
        console.error(error)
        alert(error)
      }
    }
  }
  return (
    <dialog id="signup_modal" className="modal modal-bottom sm:modal-middle">
      <div className="modal-box">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 className="font-bold text-lg">Login</h3>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="join join-vertical w-full gap-3 mt-2 p-4">
            <FormInputField
              register={register('username')}
              placeholder="Username"
              error={errors.username}
            />
            <PasswordInputField
              register={register('password')}
              placeholder="Password"
              type="password"
              error={errors.password}
            />
            <LoadingButton type="submit" isLoading={isSubmitting}>
              Login
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
        <div className="modal-action"></div>
      </div>
    </dialog>
  )
}
