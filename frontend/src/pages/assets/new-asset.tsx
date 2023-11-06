import React from 'react'
import { useForm } from 'react-hook-form'
import * as AssetApi from '@/network/api/asset.api'
import FormInputField from '@/components/form/FormInputField'
import LoadingButton from '@/components/LoadingButton'
import { useRouter } from 'next/router'
import GoBackButton from '@/components/GoBackButton'

interface CreateAssetFormData {
  name: string
  description: string
  serialNumber: string
}

export default function CreateNewAsset() {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateAssetFormData>()
  async function onSubmit(input: CreateAssetFormData) {
    try {
      const response = await AssetApi.createAsset(input)
      await router.push(`/assets/${response._id}`)
    } catch (error: any) {
      console.error(error.message)
      alert(error)
    }
  }
  return (
    <>
      <div className="container mx-auto max-w-[1000px] px-2">
        <h1 className="title">Create new asset</h1>
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
          <div className="flex flex-row items-center justify-between">
            <LoadingButton isLoading={isSubmitting} type="submit">
              Create asset
            </LoadingButton>
            <div></div>
            <GoBackButton href="/assets" />
          </div>
        </form>
      </div>
    </>
  )
}
