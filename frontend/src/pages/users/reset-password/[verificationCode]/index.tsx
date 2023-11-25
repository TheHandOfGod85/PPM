import {
  BadRequestError,
  NotFoundError,
  UnauthorisedError,
} from '@/network/http-errors'
import { emailSchema, passwordSchema } from '@/utils/validation'
import { yupResolver } from '@hookform/resolvers/yup'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import * as UsersApi from '@/network/api/user.api'
import FormInputField from '@/components/form/FormInputField'
import LoadingButton from '@/components/LoadingButton'
import ErrorText from '@/components/ErrorText'
import Head from 'next/head'
import useAuthenticatedUser from '@/hooks/useAuthenticatedUser'
import { useRouter } from 'next/router'
import PasswordInputField from '@/components/form/PasswordInputField'

const validationSchema = yup.object({
  email: emailSchema.required(),
  password: passwordSchema.required(),
})
type ResetPasswordFormData = yup.InferType<typeof validationSchema>

export default function ResetPassword() {
  const { user } = useAuthenticatedUser()
  const [errorText, setErrorText] = useState<string | null>(null)
  const { mutateUser } = useAuthenticatedUser()
  const router = useRouter()
  const verificationCode = router.query.verificationCode?.toString()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: yupResolver(validationSchema),
  })

  async function onSubmit(credentials: ResetPasswordFormData) {
    try {
      setErrorText(null)
      const user = await UsersApi.resetPassword(credentials, verificationCode)
      mutateUser(user)
      router.push('/')
    } catch (error) {
      if (error instanceof NotFoundError) {
        setErrorText('Invalid credentials')
      } else if (error instanceof BadRequestError) {
        setErrorText(error.message)
      } else {
        console.error(error)
        alert(error)
      }
    }
  }
  if (user) {
    router.push('/')
  } else {
    return (
      <>
        <Head>
          <title>Reset password</title>
          <meta name="description" content="Reset password request page" />
        </Head>
        <div className="flex flex-col max-w-3xl mx-auto px-2 justify-center h-screen ">
          <div className="card bg-neutral shadow-2xl w-full">
            <div className="card-body">
              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="join join-vertical w-full gap-3 mt-2 p-4">
                  <h3 className="card-title">Reset password</h3>
                  <FormInputField
                    register={register('email')}
                    placeholder="Email"
                    error={errors.email}
                  />
                  <PasswordInputField
                    register={register('password')}
                    placeholder="Password"
                    error={errors.password}
                  />
                  <LoadingButton
                    type="submit"
                    className="btn-accent"
                    isLoading={isSubmitting}
                  >
                    Send
                  </LoadingButton>
                  {errorText && <ErrorText errorText={errorText} />}
                </div>
              </form>
            </div>
          </div>
        </div>
      </>
    )
  }
}
