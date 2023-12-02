'use client'
import * as UsersApi from '@/app/lib/data/user.data'
import { NotFoundError, TooManyRequestsError } from '@/app/lib/http-errors'
import { openModal } from '@/utils/utils'
import { emailSchema } from '@/utils/validation'
import { yupResolver } from '@hookform/resolvers/yup'
import Link from 'next/link'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import AlertDaisy from '../Alert'
import ErrorText from '../ErrorText'
import LoadingButton from '../LoadingButton'
import FormInputField from '../form/FormInputField'

const validationSchema = yup.object({
  email: emailSchema.required(),
})
type RequestPasswordFormData = yup.InferType<typeof validationSchema>

export default function ResetPasswordRequestForm() {
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
      } else if (error instanceof TooManyRequestsError) {
        setErrorText('Too many requests, please try later.')
      } else {
        console.error(error)
        alert(error)
      }
    }
  }

  return (
    <>
      <div className="flex flex-col max-w-3xl mx-auto px-2 justify-center h-screen ">
        <div className="relative">
          <div className="absolute inset-0.5 bg-neutral-400 rounded-lg blur-lg"></div>
          <div className="card relative bg-neutral w-full">
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
      </div>
      <AlertDaisy message="Email sent, please check your inbox" />
    </>
  )
}
