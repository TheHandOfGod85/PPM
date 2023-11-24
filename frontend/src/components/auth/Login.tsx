import { useForm } from 'react-hook-form'
import * as UsersApi from '@/network/api/user.api'
import FormInputField from '../form/FormInputField'
import PasswordInputField from '../form/PasswordInputField'
import LoadingButton from '../LoadingButton'
import { useState } from 'react'
import { UnauthorisedError } from '@/network/http-errors'
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

export default function Login() {
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
      if (error instanceof UnauthorisedError) {
        setErrorText('Invalid credentials')
      } else {
        console.error(error)
        alert(error)
      }
    }
  }

  return (
    <div className="flex flex-col max-w-3xl mx-auto px-2 justify-center h-screen ">
      <h1 className="title">Welcome - PPM System</h1>
      <div className="card bg-neutral shadow-2xl w-full">
        <div className="card-body">
          <h3 className="card-title">Login</h3>
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
              <LoadingButton
                type="submit"
                className="btn-accent"
                isLoading={isSubmitting}
              >
                Login
              </LoadingButton>
              {errorText && <ErrorText errorText={errorText} />}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
