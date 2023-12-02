'use client'
import * as yup from 'yup'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { requiredStringSchema } from '@/utils/validation'
import * as AssetApi from '@/app/lib/data/assets.data'
import { Asset } from '@/app/lib/models/asset'
import { BadRequestError } from '@/app/lib/http-errors'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import FormInputField from '../form/FormInputField'
import ErrorText from '../ErrorText'
import { openModal } from '@/utils/utils'
import GoBackButton from '../GoBackButton'
import PopUpConfirm from '../PopUpConfirm'
import { User } from '@/app/lib/models/user'

const validationSchema = yup.object({
  name: requiredStringSchema,
  description: yup.string(),
  serialNumber: requiredStringSchema,
})
type EditAssetFormData = yup.InferType<typeof validationSchema>

interface EditAssetFormProps {
  asset: Asset
  user: User
}

export default function EditAssetForm({ asset, user }: EditAssetFormProps) {
  const [errorText, setErrorText] = useState<string | null>(null)
  const router = useRouter()

  async function onSubmit({
    name,
    description,
    serialNumber,
  }: EditAssetFormData) {
    try {
      await AssetApi.editAsset(
        {
          name,
          description,
          serialNumber,
        },
        asset._id
      )
      await router.push(`/assets`)
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
  } = useForm<EditAssetFormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      description: asset.description,
      name: asset.name,
      serialNumber: asset.serialNumber,
    },
  })

  if (user?.role !== 'admin') {
    router.push('/')
  } else {
    return (
      <>
        <div className="container mx-auto max-w-[1000px] px-2">
          <h1 className="title">Edit asset</h1>
          <form>
            <div className="join join-vertical w-full gap-5">
              <FormInputField
                register={register('name')}
                placeholder="Edit part name"
                maxLength={100}
                error={errors.name}
              />
              <FormInputField
                register={register('serialNumber')}
                placeholder="Edit asset serial number"
                maxLength={100}
                error={errors.serialNumber}
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
                onClick={() => openModal('edit_asset_confirm')}
              >
                Edit
              </button>
              <div></div>
              <GoBackButton href={`/assets`} />
            </div>
          </form>
        </div>
        <PopUpConfirm
          id="edit_asset_confirm"
          title="Edit asset"
          infoMessage={`Are you sure you want to edit asset ${asset.name}?`}
          buttonSubmit="Yes"
          button2="No"
          onSubmit={handleSubmit(onSubmit)}
        />
      </>
    )
  }
}
