'use client'
import * as PartApi from '@/app/lib/data/part.data'
import { BadRequestError } from '@/app/lib/http-errors'
import { Part } from '@/app/lib/models/part'
import useAuthenticatedUser from '@/hooks/useAuthenticatedUser'
import { openModal } from '@/utils/utils'
import { fileSchema, requiredStringSchema } from '@/utils/validation'
import { yupResolver } from '@hookform/resolvers/yup'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import ErrorText from '../ErrorText'
import GoBackButton from '../GoBackButton'
import PopUpConfirm from '../PopUpConfirm'
import FormInputField from '../form/FormInputField'

interface EditPartFormProps {
  part: Part
}

const validationSchema = yup.object({
  name: requiredStringSchema,
  description: yup.string(),
  manufacturer: requiredStringSchema,
  partNumber: requiredStringSchema,
  partImage: fileSchema,
})
type EdiPartFormData = yup.InferType<typeof validationSchema>

export default function EditPartForm({ part }: EditPartFormProps) {
  const { user } = useAuthenticatedUser()
  const [errorText, setErrorText] = useState<string | null>(null)
  const router = useRouter()

  async function onSubmit({
    manufacturer,
    name,
    partNumber,
    description,
    partImage,
  }: EdiPartFormData) {
    try {
      setErrorText(null)
      await PartApi.updatePartAsset(
        {
          manufacturer,
          name,
          partNumber,
          description,
          partImage: partImage?.item(0) || undefined,
        },
        part._id
      )
      router.refresh()
      router.push(`/dashboard/assets/${part.asset._id}`)
    } catch (error) {
      if (error instanceof BadRequestError) {
        setErrorText(error.message)
        console.error(error)
      } else {
        console.error(error)
        alert(error)
      }
    }
  }
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<EdiPartFormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      description: part.description,
      manufacturer: part.manufacturer,
      name: part.name,
      partNumber: part.partNumber,
    },
  })
  if (user?.role !== 'admin') {
    router.push('/')
  } else {
    return (
      <>
        <div className="container mx-auto max-w-[1000px] px-2">
          <h1 className="title">Edit part</h1>
          <form>
            <div className="join join-vertical w-full gap-5">
              <FormInputField
                register={register('name')}
                placeholder="Edit part name"
                maxLength={100}
                error={errors.name}
              />
              <FormInputField
                register={register('partNumber')}
                placeholder="Edit part number"
                maxLength={100}
                error={errors.partNumber}
              />
              <FormInputField
                register={register('manufacturer')}
                placeholder="Edit part manufacturer"
                maxLength={100}
                error={errors.manufacturer}
              />
              <FormInputField
                register={register('partImage')}
                isFileStyle
                type="file"
                accept="image/png,image/jpeg"
                error={errors.partImage}
              />
              <FormInputField
                placeholder="Edit part description"
                register={register('description')}
                textarea
                maxLength={500}
              />
              {errorText && <ErrorText errorText={errorText} />}
            </div>
            <div className="flex flex-row items-center justify-between mt-2">
              <button
                type="button"
                className="btn btn-neutral"
                onClick={() => openModal('edit_part_confirm')}
              >
                Edit
              </button>
              <div></div>
              <GoBackButton href={`/dashboard/assets/${part.asset._id}`} />
            </div>
          </form>
        </div>
        <PopUpConfirm
          id="edit_part_confirm"
          title="Edit part"
          infoMessage={`Are you sure you want to edit part ${part.name}?`}
          buttonSubmit="Yes"
          button2="No"
          onSubmit={handleSubmit(onSubmit)}
        />
      </>
    )
  }
}
