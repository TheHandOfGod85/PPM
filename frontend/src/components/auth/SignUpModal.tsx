import { useForm } from 'react-hook-form'
import * as UsersApi from '@/network/api/user.api'
import FormInputField from '../form/FormInputField'
import PasswordInputField from '../form/PasswordInputField'
import LoadingButton from '../LoadingButton'
import SelectInputField from '../form/SelectInputField'

const roles = ['admin', 'user']

interface SignUpModalProps {
  onDismiss: () => void
  //   onLoginInsteadClicked: () => void
}

interface SignUpFomrData {
  username: string
  email: string
  password: string
  role?: string
}
export default function SignUpModal({ onDismiss }: SignUpModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFomrData>()
  async function onSubmit(credentials: SignUpFomrData) {
    try {
      const newUser = await UsersApi.SignUp(credentials)
      alert(JSON.stringify(newUser))
    } catch (error) {
      console.error(error)
      alert(error)
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
        <h3 className="font-bold text-lg">New user registration</h3>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="join join-vertical w-full gap-3 mt-2 p-4">
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
            <LoadingButton type="submit" isLoading={isSubmitting}>
              Create user
            </LoadingButton>
          </div>
        </form>
        <div className="modal-action"></div>
      </div>
    </dialog>
  )
}
