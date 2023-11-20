import { useForm } from 'react-hook-form'
import * as UsersApi from '@/network/api/user.api'
import FormInputField from '../form/FormInputField'
import PasswordInputField from '../form/PasswordInputField'
import LoadingButton from '../LoadingButton'
import { useState } from 'react'
import { UnathuorizedError } from '@/network/http-errors'
import useAuthenticatedUser from '@/hooks/useAuthenticatedUser'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { requiredStringSchema } from '@/utils/validation'
import ErrorText from '../ErrorText'

const validationSchema = yup.object({
  username: requiredStringSchema,
  password: requiredStringSchema,
})

type LoginFormData = yup.InferType<typeof validationSchema>

export default function LoginModal() {
  const { mutateUser } = useAuthenticatedUser()

  const [errorText, setErrorText] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: yupResolver(validationSchema),
  })

  async function onSubmit(credentials: LoginFormData) {
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
              placeholder="Email"
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
            {errorText && <ErrorText errorText={errorText} />}
          </div>
        </form>
      </div>
    </dialog>
  )
}
