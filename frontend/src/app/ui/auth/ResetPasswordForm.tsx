'use client'
import { emailSchema, passwordSchema } from '@/utils/validation'
import { yupResolver } from '@hookform/resolvers/yup'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as UsersApi from '@/lib/data/user.data'
import * as yup from 'yup'
import { BadRequestError, NotFoundError } from '@/lib/http-errors'
import FormInputField from '../form/FormInputField'
import PasswordInputField from '../form/PasswordInputField'
import LoadingButton from '../LoadingButton'
import ErrorText from '../ErrorText'

interface ResetPasswordFormProps {
  verificationCode: string
}

const validationSchema = yup.object({
  email: emailSchema.required(),
  password: passwordSchema.required(),
})
type ResetPasswordFormData = yup.InferType<typeof validationSchema>

export default function ResetPasswordForm({
  verificationCode,
}: ResetPasswordFormProps) {
  const [errorText, setErrorText] = useState<string | null>(null)
  const router = useRouter()

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
      await UsersApi.resetPassword(credentials, verificationCode)
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

  return (
    <div className="flex flex-col max-w-3xl mx-auto px-2 justify-center h-screen ">
      <div className="relative">
        <div className="absolute inset-0.5 bg-neutral-400 rounded-lg blur-lg"></div>
        <div className="card relative bg-neutral w-full">
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
    </div>
  )
}
