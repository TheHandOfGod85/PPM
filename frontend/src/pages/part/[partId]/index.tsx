import ErrorText from '@/components/ErrorText'
import GoBackButton from '@/components/GoBackButton'
import PopUpConfirm from '@/components/PopUpConfirm'
import FormInputField from '@/components/form/FormInputField'
import { Part } from '@/models/part'
import * as PartApi from '@/network/api/part.api'
import { BadRequestError, NotFoundError } from '@/network/http-errors'
import { openModal } from '@/utils/utils'
import { fileSchema, requiredStringSchema } from '@/utils/validation'
import { yupResolver } from '@hookform/resolvers/yup'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'

export const getServerSideProps: GetServerSideProps<EditPartProps> = async (
  context: GetServerSidePropsContext
) => {
  try {
    const partId = context.params?.partId?.toString()
    const { cookie } = context.req.headers
    if (!partId) throw Error('Part id missing')
    const part = await PartApi.getPartById(partId, cookie)
    return { props: { part } }
  } catch (error) {
    if (error instanceof NotFoundError) {
      return { notFound: true }
    } else {
      throw error
    }
  }
}
interface EditPartProps {
  part: Part
}
const validationSchema = yup.object({
  name: requiredStringSchema,
  description: yup.string(),
  manufacturer: requiredStringSchema,
  partNumber: requiredStringSchema,
  partImage: fileSchema,
})
type EdiPartFormData = yup.InferType<typeof validationSchema>

export default function EditPart({ part }: EditPartProps) {
  async function onSubmit({
    manufacturer,
    name,
    partNumber,
    description,
    partImage,
  }: EdiPartFormData) {
    try {
      setErrorText(null)
      await PartApi.updatePartAsset(
        {
          manufacturer,
          name,
          partNumber,
          description,
          partImage: partImage?.item(0) || undefined,
        },
        part._id
      )
      await router.push(`/assets/${part.asset._id}`)
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
  const [errorText, setErrorText] = useState<string | null>(null)
  const router = useRouter()
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<EdiPartFormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      description: part.description,
      manufacturer: part.manufacturer,
      name: part.name,
      partNumber: part.partNumber,
    },
  })
  return (
    <>
      <div className="container mx-auto max-w-[1000px] px-2">
        <h1 className="title">Edit part</h1>
        <form>
          <div className="join join-vertical w-full gap-5">
            <FormInputField
              register={register('name')}
              placeholder="Edit part name"
              maxLength={100}
              error={errors.name}
            />
            <FormInputField
              register={register('partNumber')}
              placeholder="Edit part number"
              maxLength={100}
              error={errors.partNumber}
            />
            <FormInputField
              register={register('manufacturer')}
              placeholder="Edit part manufacturer"
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
              onClick={() => openModal('edit_part_confirm')}
            >
              Edit
            </button>
            <div></div>
            <GoBackButton href={`/assets/${part.asset._id}`} />
          </div>
        </form>
      </div>
      <PopUpConfirm
        id="edit_part_confirm"
        title="Edit part"
        infoMessage={`Are you sure you want to edit part ${part.name}?`}
        buttonSubmit="Yes"
        button2="No"
        onSubmit={handleSubmit(onSubmit)}
      />
    </>
  )
}
