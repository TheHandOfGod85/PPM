import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as AssetApi from '@/network/api/asset.api'
import FormInputField from '@/components/form/FormInputField'
import LoadingButton from '@/components/LoadingButton'
import { useRouter } from 'next/router'
import GoBackButton from '@/components/GoBackButton'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { requiredStringSchema } from '@/utils/validation'
import ErrorText from '@/components/ErrorText'
import { BadRequestError, ConflictError } from '@/network/http-errors'

const validationSchema = yup.object({
  name: requiredStringSchema,
  description: yup.string(),
  serialNumber: requiredStringSchema,
})

type CreateAssetFormData = yup.InferType<typeof validationSchema>

export default function CreateNewAsset() {
  const [errorText, setErrorText] = useState<string | null>(null)
  const router = useRouter()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateAssetFormData>({
    resolver: yupResolver(validationSchema),
  })
  async function onSubmit(input: CreateAssetFormData) {
    try {
      setErrorText(null)
      const response = await AssetApi.createAsset(input)
      await router.push(`/assets/${response._id}`)
    } catch (error) {
      if (error instanceof ConflictError || error instanceof BadRequestError) {
        reset()
        setErrorText(error.message)
      } else {
        console.error(error)
        reset()
        alert(error)
      }
    }
  }
  return (
    <>
      <div className="container mx-auto max-w-[1000px] px-2">
        <h1 className="title">Create new asset</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="join join-vertical w-full gap-5">
            <FormInputField
              register={register('name')}
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
              register={register('serialNumber')}
              placeholder="Asset serial number"
              maxLength={500}
              error={errors.serialNumber}
            />
            {errorText && <ErrorText errorText={errorText} />}
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
