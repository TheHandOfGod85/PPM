import * as UsersApi from '@/network/api/user.api'
import { BadRequestError, ConflictError } from '@/network/http-errors'
import { closeModal, openModal } from '@/utils/utils'
import { emailSchema } from '@/utils/validation'
import { yupResolver } from '@hookform/resolvers/yup'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import AlertDaisy from '../Alert'
import ErrorText from '../ErrorText'
import LoadingButton from '../LoadingButton'
import FormInputField from '../form/FormInputField'
import SelectInputField from '../form/SelectInputField'

const roles = ['admin', 'user']

const validationSchema = yup.object({
  email: emailSchema.required('Required'),
  role: yup.string().oneOf(roles, 'Please provide a role').required('Required'),
})

type SendRegistrationFormData = yup.InferType<typeof validationSchema>

export default function SignUpModal() {
  const [errorText, setErrorText] = useState<string | null>(null)
  const router = useRouter()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SendRegistrationFormData>({
    resolver: yupResolver(validationSchema),
  })
  async function onSubmit({ email, role }: SendRegistrationFormData) {
    try {
      setErrorText(null)
      await UsersApi.sendRegistration(email, role)
      router.replace(router.asPath)
      closeModal('send_registration_modal')
      openModal('alert')
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
    <>
      <dialog
        id="send_registration_modal"
        className="modal modal-bottom sm:modal-middle"
      >
        <div className="modal-box">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <form method="dialog" onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="join join-vertical w-full gap-3 mt-2 p-4">
              <h3 className="font-bold text-lg">New user send registration</h3>
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
              <div className="modal-action justify-start">
                <LoadingButton type="submit" isLoading={isSubmitting}>
                  Send link
                </LoadingButton>
              </div>
              {errorText && <ErrorText errorText={errorText} />}
            </div>
          </form>
        </div>
      </dialog>
      <AlertDaisy message="Email sent successfully!" />
    </>
  )
}
