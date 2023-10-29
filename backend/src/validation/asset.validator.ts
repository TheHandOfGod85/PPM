import * as yup from 'yup'

const createaAssetSchema = yup.object({
  name: yup
    .string()
    .required('Name is required')
    .max(100, 'Max 100 characters'),
  description: yup.string().max(500, 'Max 500 characters'),
  serialNumber: yup.string().required('Serial Number is required'),
})

export type AssetBody = yup.InferType<typeof createaAssetSchema>

export const createAssetValidator = yup.object({
  body: createaAssetSchema,
})

//###############################################################
