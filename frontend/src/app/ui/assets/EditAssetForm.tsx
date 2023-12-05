'use client'
import useAuthenticatedUser from '@/hooks/useAuthenticatedUser'
import * as AssetApi from '@/lib/data/assets.data'
import { BadRequestError } from '@/lib/http-errors'
import { openModal } from '@/utils/utils'
import { requiredStringSchema } from '@/utils/validation'
import { yupResolver } from '@hookform/resolvers/yup'
import { redirect, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import useSWR from 'swr'
import * as yup from 'yup'
import ErrorText from '../ErrorText'
import GoBackButton from '../GoBackButton'
import PopUpConfirm from '../PopUpConfirm'
import FormInputField from '../form/FormInputField'

const validationSchema = yup.object({
  name: requiredStringSchema,
  description: yup.string(),
  serialNumber: requiredStringSchema,
})
type EditAssetFormData = yup.InferType<typeof validationSchema>

interface EditAssetFormProps {
  assetId: string
}

export default function EditAssetForm({ assetId }: EditAssetFormProps) {
  const router = useRouter()
  const { user } = useAuthenticatedUser()
  useEffect(() => {
    if (user?.role !== 'admin') {
      redirect('/dashboard')
    }
  }, [user, router])
  const { data: asset } = useSWR(
    ['get-asset', assetId],
    async () => await AssetApi.getAsset(assetId)
  )

  const [errorText, setErrorText] = useState<string | null>(null)

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
        assetId
      )
      router.push(`/dashboard/assets`)
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
    setValue,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<EditAssetFormData>({
    resolver: yupResolver(validationSchema),
  })

  useEffect(() => {
    if (asset) {
      setValue('name', asset.name || '')
      setValue('description', asset.description || '')
      setValue('serialNumber', asset.serialNumber || '')
    }
  }, [asset, setValue])

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
            <GoBackButton href={`/dashboard/assets`} />
          </div>
        </form>
      </div>
      <PopUpConfirm
        id="edit_asset_confirm"
        title="Edit asset"
        infoMessage={`Are you sure you want to edit asset ${asset?.name}?`}
        buttonSubmit="Yes"
        button2="No"
        onSubmit={handleSubmit(onSubmit)}
      />
    </>
  )
}
