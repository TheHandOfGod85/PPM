import useAuthenticatedUser from '@/hooks/useAuthenticatedUser'
import * as UsersApi from '@/network/api/user.api'
import { BadRequestError, ConflictError } from '@/network/http-errors'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import LoadingButton from '../LoadingButton'
import FormInputField from '../form/FormInputField'
import PasswordInputField from '../form/PasswordInputField'
import SelectInputField from '../form/SelectInputField'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { emailSchema, passwordSchema, usernameSchema } from '@/utils/validation'
import ErrorText from '../ErrorText'
import { useRouter } from 'next/router'

const roles = ['admin', 'user']

const validationSchema = yup.object({
  username: usernameSchema.required('Required'),
  email: emailSchema.required('Required'),
  password: passwordSchema.required('Required'),
  role: yup.string().oneOf(roles, 'Please provide a role'),
})

type SignUpFormData = yup.InferType<typeof validationSchema>

export default function SignUpModal() {
  const router = useRouter()
  const { mutateUser } = useAuthenticatedUser()
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
      const newUser = await UsersApi.SignUp(credentials)
      mutateUser(newUser)
      router.reload()
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
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <form method="dialog" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="join join-vertical w-full gap-3 mt-2 p-4">
            <h3 className="font-bold text-lg">New user registration</h3>
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
            <div className="modal-action justify-start">
              <LoadingButton type="submit" isLoading={isSubmitting}>
                Create user
              </LoadingButton>
            </div>
            {errorText && <ErrorText errorText={errorText} />}
          </div>
        </form>
      </div>
    </dialog>
  )
}
