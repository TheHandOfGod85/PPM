'use client'
import { User } from '@/app/lib/models/user'
import { passwordSchema, usernameSchema } from '@/utils/validation'
import { yupResolver } from '@hookform/resolvers/yup'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as UsersApi from '@/app/lib/data/user.data'
import * as yup from 'yup'
import { BadRequestError, ConflictError } from '@/app/lib/http-errors'
import FormInputField from '../form/FormInputField'
import PasswordInputField from '../form/PasswordInputField'
import LoadingButton from '../LoadingButton'
import ErrorText from '../ErrorText'

const validationSchema = yup.object({
  username: usernameSchema.required('Required'),
  password: passwordSchema.required('Required'),
  about: yup.string(),
  displayName: yup.string(),
})

type SignUpFormData = yup.InferType<typeof validationSchema>

interface SignupFomProps {
  user: User
  userId: string
  verificationCode: string
}

export default function SignupFom({
  user,
  userId,
  verificationCode,
}: SignupFomProps) {
  const [errorText, setErrorText] = useState<string | null>(null)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    resolver: yupResolver(validationSchema),
  })
  async function onSubmit(credentials: SignUpFormData) {
    try {
      setErrorText(null)
      await UsersApi.SignUp(credentials, userId, verificationCode)
      router.push('/')
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
  if (user) {
    router.push('/')
  } else {
    return (
      <div className="flex flex-col max-w-3xl mx-auto px-2 justify-center h-screen ">
        <div className="card bg-neutral shadow-2xl w-full ">
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="card-body">
              <h3 className="card-title">New user registration</h3>
              <div className="join join-vertical gap-3">
                <FormInputField
                  register={register('username')}
                  placeholder="Username"
                  error={errors.username}
                />
                <FormInputField
                  register={register('displayName')}
                  placeholder="Diplayname"
                  error={errors.displayName}
                />
                <FormInputField
                  register={register('about')}
                  placeholder="About"
                  error={errors.about}
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
                  Register
                </LoadingButton>
                {errorText && <ErrorText errorText={errorText} />}
              </div>
            </div>
          </form>
        </div>
      </div>
    )
  }
}
