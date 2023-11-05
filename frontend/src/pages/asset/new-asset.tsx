import React from 'react'
import { useForm } from 'react-hook-form'
import * as AssetApi from '@/network/api/asset.api'
import FormInputField from '@/components/form/FormInputField'
import LoadingButton from '@/components/LoadingButton'

interface CreateAssetFormData {
  name: string
  description: string
  serialNumber: string
}

export default function CreateNewAsset() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateAssetFormData>()
  async function onSubmit(input: CreateAssetFormData) {
    try {
      const response = await AssetApi.createAsset(input)
      console.log(process.env.NEXT_PUBLIC_BACKEND_URL)
      alert('Asset created successfully')
    } catch (error: any) {
      console.error(error.message)
      alert(error)
    }
  }
  return (
    <>
      <h1 className="font-extrabold text-2xl text-center mb-5">
        Create new asset
      </h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="join join-vertical w-full gap-5">
          <FormInputField
            register={register('name', { required: 'Name Required' })}
            placeholder="Asset name"
            maxLength={100}
            error={errors.name}
          />
          <FormInputField
            placeholder="Asset description"
            register={register('description')}
            textarea
            maxLength={500}
          />
          <FormInputField
            register={register('serialNumber', {
              required: 'Serial Number Required',
            })}
            placeholder="Asset serial number"
            maxLength={500}
            error={errors.serialNumber}
          />
        </div>
        <LoadingButton isLoading={isSubmitting} type="submit">
          Create asset
        </LoadingButton>
      </form>
    </>
  )
}
