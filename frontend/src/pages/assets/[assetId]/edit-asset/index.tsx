import { Asset } from '@/models/asset'
import { BadRequestError, NotFoundError } from '@/network/http-errors'
import { GetServerSideProps } from 'next'
import * as AssetApi from '@/network/api/asset.api'
import * as yup from 'yup'
import { requiredStringSchema } from '@/utils/validation'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import useUnsavedChangesWarning from '@/hooks/useUnsavedChangesWarning'
import FormInputField from '@/components/form/FormInputField'
import ErrorText from '@/components/ErrorText'
import { openModal } from '@/utils/utils'
import GoBackButton from '@/components/GoBackButton'
import PopUpConfirm from '@/components/PopUpConfirm'
import { getAuthenticatedUser } from '@/network/api/user.api'

export const getServerSideProps: GetServerSideProps<EditAssetProps> = async (
  context
) => {
  try {
    const { cookie } = context.req.headers
    const user = await getAuthenticatedUser(cookie)
    if (user.role !== 'admin') {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      }
    }
    const assetId = context.params?.assetId?.toString()
    if (!assetId) throw Error('Asset id missing')
    const asset = await AssetApi.getAsset(assetId, cookie)
    return { props: { asset } }
  } catch (error) {
    if (error instanceof NotFoundError) {
      return { notFound: true }
    } else {
      throw error
    }
  }
}
interface EditAssetProps {
  asset: Asset
}
const validationSchema = yup.object({
  name: requiredStringSchema,
  description: yup.string(),
  serialNumber: requiredStringSchema,
})
type EditAssetFormData = yup.InferType<typeof validationSchema>

export default function EditAsset({ asset }: EditAssetProps) {
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
  useUnsavedChangesWarning(isDirty && !isSubmitting)
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
