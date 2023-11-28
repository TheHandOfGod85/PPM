import ErrorText from '@/components/ErrorText'
import GoBackButton from '@/components/GoBackButton'
import LoadingButton from '@/components/LoadingButton'
import FormInputField from '@/components/form/FormInputField'
import { useUser } from '@/contexts/AuthProvider'
import * as PartApi from '@/network/api/part.api'
import { BadRequestError, ConflictError } from '@/network/http-errors'
import { fileSchema, requiredStringSchema } from '@/utils/validation'
import { yupResolver } from '@hookform/resolvers/yup'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'

const validationSchema = yup.object({
  name: requiredStringSchema,
  description: yup.string(),
  manufacturer: requiredStringSchema,
  partNumber: requiredStringSchema,
  partImage: fileSchema,
})

type CreatePartFormData = yup.InferType<typeof validationSchema>

export default function CreatePartAsset() {
  const { user } = useUser()
  const [errorText, setErrorText] = useState<string | null>(null)
  const router = useRouter()
  const assetId = router.query.assetId?.toString()
  if (!assetId) throw Error('Asset Id missing')
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreatePartFormData>({
    resolver: yupResolver(validationSchema),
  })
  async function onSubmit({
    name,
    description,
    partNumber,
    manufacturer,
    partImage,
  }: CreatePartFormData) {
    try {
      setErrorText(null)
      await PartApi.createPartAsset(
        {
          name,
          description,
          manufacturer,
          partNumber,
          partImage: partImage?.item(0) || undefined,
        },
        assetId!
      )
      router.push(`/assets/${assetId}`)
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
  useEffect(() => {
    if (user?.role !== 'admin') {
      router.push('/') // Redirect asynchronously
    }
    return () => {}
  }, [user, router])
  return (
    <>
      <Head>
        <title>New part - PPM System</title>
        <meta name="description" content="New part page" />
      </Head>
      <div className="container mx-auto max-w-[1000px] px-2">
        <h1 className="title">Create new part</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="join join-vertical w-full gap-5">
            <FormInputField
              register={register('name')}
              placeholder="Part name"
              maxLength={100}
              error={errors.name}
            />
            <FormInputField
              register={register('partNumber')}
              placeholder="Asset part number"
              maxLength={100}
              error={errors.partNumber}
            />
            <FormInputField
              register={register('manufacturer')}
              placeholder="Asset part manufacturer"
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
              placeholder="Asset description"
              register={register('description')}
              textarea
              maxLength={500}
            />
            {errorText && <ErrorText errorText={errorText} />}
          </div>
          <div className="flex flex-row items-center justify-between">
            <LoadingButton
              isLoading={isSubmitting}
              className="mt-3"
              type="submit"
            >
              Create part
            </LoadingButton>
            <div></div>
            <GoBackButton href={`/assets/${assetId}`} />
          </div>
        </form>
      </div>
    </>
  )
}
