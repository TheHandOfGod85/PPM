import * as yup from 'yup'
import { objectIdSchema } from '../utils/validators'

//###############################################################

const assetBodySchema = yup.object({
  name: yup.string().required().max(100),
  description: yup.string().max(500),
  serialNumber: yup.string().required(),
})

export type AssetBody = yup.InferType<typeof assetBodySchema>

//###############################################################
export const createAssetValidator = yup.object({
  body: assetBodySchema,
})
//###############################################################
export const idAssetValidator = yup.object({
  params: yup.object({
    assetId: objectIdSchema,
  }),
})

export type IdAssetParams = yup.InferType<typeof idAssetValidator>['params']
//###############################################################

export const queryAssetValidator = yup.object({
  query: yup.object({
    // id: objectIdSchema,
    page: yup.string(),
    filter: yup.string(),
  }),
})

export type GetAssetsQuery = yup.InferType<typeof queryAssetValidator>['query']

//###############################################################

export const updateAssetvalidator = yup.object({
  params: yup.object({
    _id: objectIdSchema,
  }),
  body: assetBodySchema,
})
export type UpdateAssetParams = yup.InferType<
  typeof updateAssetvalidator
>['params']
//###############################################################
