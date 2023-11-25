import { NotFoundError, UnauthorisedError } from '@/network/http-errors'
import { emailSchema } from '@/utils/validation'
import { yupResolver } from '@hookform/resolvers/yup'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import * as UsersApi from '@/network/api/user.api'
import FormInputField from '@/components/form/FormInputField'
import LoadingButton from '@/components/LoadingButton'
import ErrorText from '@/components/ErrorText'
import Head from 'next/head'
import AlertDaisy from '@/components/Alert'
import { openModal } from '@/utils/utils'
import useAuthenticatedUser from '@/hooks/useAuthenticatedUser'
import { useRouter } from 'next/router'
import Link from 'next/link'

const validationSchema = yup.object({
  email: emailSchema.required(),
})
type RequestPasswordFormData = yup.InferType<typeof validationSchema>

export default function RequestPasswordRequest() {
  const { user } = useAuthenticatedUser()
  const router = useRouter()
  const [errorText, setErrorText] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RequestPasswordFormData>({
    resolver: yupResolver(validationSchema),
  })

  async function onSubmit({ email }: RequestPasswordFormData) {
    try {
      setErrorText(null)
      await UsersApi.requestResetPasswordCode(email)
      openModal('alert')
    } catch (error) {
      if (error instanceof NotFoundError) {
        setErrorText('Invalid email')
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
          <title>Reset password request</title>
          <meta name="description" content="Reset password request page" />
        </Head>
        <div className="flex flex-col max-w-3xl mx-auto px-2 justify-center h-screen ">
          <div className="card bg-neutral shadow-2xl w-full">
            <div className="card-body">
              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="join join-vertical w-full gap-3 mt-2 p-4">
                  <h3 className="card-title">Reset password request</h3>
                  <FormInputField
                    register={register('email')}
                    placeholder="Email"
                    error={errors.email}
                  />
                  <LoadingButton
                    type="submit"
                    className="btn-accent"
                    isLoading={isSubmitting}
                  >
                    Send
                  </LoadingButton>
                  <Link
                    className="text-end underline hover:text-accent-focus"
                    href={'/'}
                  >
                    Login
                  </Link>
                  {errorText && <ErrorText errorText={errorText} />}
                </div>
              </form>
            </div>
          </div>
        </div>
        <AlertDaisy message="Email sent, please check your inbox" />
      </>
    )
  }
}
