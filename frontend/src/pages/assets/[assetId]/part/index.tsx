import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import * as AssetApi from '@/network/api/asset.api'
import FormInputField from '@/components/form/FormInputField'
import LoadingButton from '@/components/LoadingButton'
import GoBackButton from '@/components/GoBackButton'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { fileSchema, requiredStringSchema } from '@/utils/validation'
import { useState } from 'react'
import { BadRequestError, ConflictError } from '@/network/http-errors'
import ErrorText from '@/components/ErrorText'

const validationSchema = yup.object({
  name: requiredStringSchema,
  description: yup.string(),
  manufacturer: requiredStringSchema,
  partNumber: requiredStringSchema,
  partImage: fileSchema,
})

type CreatePartFormData = yup.InferType<typeof validationSchema>

export default function CreatePartAsset() {
  const [errorText, setErrorText] = useState<string | null>(null)
  const router = useRouter()
  const { assetId } = router.query
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
      let imageFile = partImage as File | FileList | undefined

      // Check if it's a FileList and extract the first file
      if (imageFile instanceof FileList) {
        imageFile = imageFile[0]
      }

      if (typeof assetId === 'string') {
        await AssetApi.createPartAsset(
          {
            name,
            description,
            manufacturer,
            partNumber,
            partImage: imageFile,
          },
          assetId
        )
        router.push(`/assets/${assetId}`)
      } else {
        throw Error('Invalid assetId')
      }
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
            <LoadingButton isLoading={isSubmitting} type="submit">
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
