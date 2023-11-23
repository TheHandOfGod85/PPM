import ErrorText from '@/components/ErrorText'
import LoadingButton from '@/components/LoadingButton'
import FormInputField from '@/components/form/FormInputField'
import PasswordInputField from '@/components/form/PasswordInputField'
import * as UsersApi from '@/network/api/user.api'
import { BadRequestError, ConflictError } from '@/network/http-errors'
import { passwordSchema, usernameSchema } from '@/utils/validation'
import { yupResolver } from '@hookform/resolvers/yup'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'

const validationSchema = yup.object({
  username: usernameSchema.required('Required'),
  password: passwordSchema.required('Required'),
  about: yup.string(),
  displayName: yup.string(),
})

type SignUpFormData = yup.InferType<typeof validationSchema>

export default function SignUp() {
  const router = useRouter()
  const userId = router.query.userId?.toString()
  const verificationCode = router.query.verificationCode?.toString()
  const [errorText, setErrorText] = useState<string | null>(null)

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
  return (
    <div className="container mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="flex flex-col h-screen justify-center max-w-4xl mx-auto px-2">
          <div className="join join-vertical gap-3">
            <h3 className="font-bold text-lg">New user registration</h3>
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
            <div className="modal-action justify-start">
              <LoadingButton type="submit" isLoading={isSubmitting}>
                Register
              </LoadingButton>
            </div>
            {errorText && <ErrorText errorText={errorText} />}
          </div>
        </div>
      </form>
    </div>
  )
}