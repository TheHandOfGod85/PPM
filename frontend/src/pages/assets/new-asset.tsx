import ErrorText from '@/components/ErrorText'
import GoBackButton from '@/components/GoBackButton'
import LoadingButton from '@/components/LoadingButton'
import FormInputField from '@/components/form/FormInputField'
import useAuthenticatedUser from '@/hooks/useAuthenticatedUser'
import useUnsavedChangesWarning from '@/hooks/useUnsavedChangesWarning'
import * as AssetApi from '@/network/api/asset.api'
import { BadRequestError, ConflictError } from '@/network/http-errors'
import { requiredStringSchema } from '@/utils/validation'
import { yupResolver } from '@hookform/resolvers/yup'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'

const validationSchema = yup.object({
  name: requiredStringSchema,
  description: yup.string(),
  serialNumber: requiredStringSchema,
})

type CreateAssetFormData = yup.InferType<typeof validationSchema>

export default function CreateNewAsset() {
  const [errorText, setErrorText] = useState<string | null>(null)
  const { user } = useAuthenticatedUser()
  const router = useRouter()
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
      router.push(`/assets/`)
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

  useUnsavedChangesWarning(isDirty && !isSubmitting)
  if (user?.role !== 'admin') {
    router.push('/')
    return null
  }
  return (
    <>
      <Head>
        <title>New asset - PPM System</title>
        <meta name="description" content="New asset page" />
      </Head>
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
            <GoBackButton href="/assets" />
          </div>
        </form>
      </div>
    </>
  )
}
