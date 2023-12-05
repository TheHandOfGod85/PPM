'use client'
import * as AssetApi from '@/lib/data/assets.data'

import * as yup from 'yup'
import ErrorText from '../ErrorText'
import GoBackButton from '../GoBackButton'
import LoadingButton from '../LoadingButton'
import FormInputField from '../form/FormInputField'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import useAuthenticatedUser from '@/hooks/useAuthenticatedUser'
import { redirect, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { requiredStringSchema } from '@/utils/validation'
import { BadRequestError, ConflictError } from '@/lib/http-errors'

const validationSchema = yup.object({
  name: requiredStringSchema,
  description: yup.string(),
  serialNumber: requiredStringSchema,
})

type CreateAssetFormData = yup.InferType<typeof validationSchema>

export default function NewAssetForm() {
  const router = useRouter()
  const { user } = useAuthenticatedUser()
  useEffect(() => {
    if (user?.role !== 'admin') {
      router.push('/dashboard')
    }
  }, [user, router])
  const [errorText, setErrorText] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<CreateAssetFormData>({
    resolver: yupResolver(validationSchema),
  })
  async function onSubmit(input: CreateAssetFormData) {
    try {
      setErrorText(null)
      await AssetApi.createAsset(input)
      router.push(`/dashboard/assets`)
    } catch (error) {
      if (error instanceof ConflictError || error instanceof BadRequestError) {
        setErrorText(error.message)
      } else {
        console.error(error)
        reset()
        alert(error)
      }
    }
  }
  if (user?.role !== 'admin') {
    redirect('/dashboard')
  } else {
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
              <LoadingButton
                isLoading={isSubmitting}
                className="mt-3"
                type="submit"
              >
                Create asset
              </LoadingButton>
              <div></div>
              <GoBackButton href="/dashboard/assets" />
            </div>
          </form>
        </div>
      </>
    )
  }
}
