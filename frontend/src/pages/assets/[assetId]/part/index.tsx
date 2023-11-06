import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import * as AssetApi from '@/network/api/asset.api'
import FormInputField from '@/components/form/FormInputField'
import LoadingButton from '@/components/LoadingButton'
import GoBackButton from '@/components/GoBackButton'

interface CreatePartFormData {
  name: string
  description: string
  partNumber: string
  manufacturer: string
  partImage: FileList
}

export default function CreatePartAsset() {
  const router = useRouter()
  const { assetId } = router.query
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreatePartFormData>()
  async function onSubmit({
    name,
    description,
    partNumber,
    manufacturer,
    partImage,
  }: CreatePartFormData) {
    try {
      if (typeof assetId === 'string') {
        const response = await AssetApi.createPartAsset(
          {
            name,
            description,
            manufacturer,
            partNumber,
            partImage: partImage[0],
          },
          assetId
        )
        router.push(`/assets/${assetId}`)
      } else {
        throw Error('Invalid assetId')
      }
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <>
      <div className="container mx-auto max-w-[1000px] px-2">
        <h1 className="title">Create new part</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="join join-vertical w-full gap-5">
            <FormInputField
              register={register('name', {
                required: 'Asset part Name is required',
              })}
              placeholder="Part name"
              maxLength={100}
              error={errors.name}
            />
            <FormInputField
              register={register('partNumber', {
                required: 'Asset Part Number is Required',
              })}
              placeholder="Asset part number"
              maxLength={100}
              error={errors.partNumber}
            />
            <FormInputField
              register={register('manufacturer', {
                required: 'Asset part manufacturer is Required',
              })}
              placeholder="Asset part manufacturer"
              maxLength={100}
              error={errors.partNumber}
            />
            <FormInputField
              register={register('partImage')}
              isFile
              type="file"
              accept="image/png,image/jpeg"
            />
            <FormInputField
              placeholder="Asset description"
              register={register('description')}
              textarea
              maxLength={500}
            />
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
