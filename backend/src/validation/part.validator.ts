import * as yup from 'yup'
import { objectIdSchema } from '../utils/validators'

//###############################################################
const partBodySchema = yup.object({
  name: yup.string().required().max(100),
  description: yup.string().max(500),
  partNumber: yup.string().required(),
  manufacturer: yup.string().required(),
  asset: objectIdSchema,
})
export type PartBody = yup.InferType<typeof partBodySchema>
//###############################################################

export const createPartValidator = yup.object({
  body: partBodySchema,
})
//###############################################################
export const idPartValidator = yup.object({
  params: yup.object({
    partId: objectIdSchema.required(),
  }),
})

export type IdPartParams = yup.InferType<typeof idPartValidator>['params']
//###############################################################
export const assetIdPartValidator = yup.object({
  params: yup.object({
    assetId: objectIdSchema.required(),
  }),
})

export type AsseetIdPartParams = yup.InferType<
  typeof assetIdPartValidator
>['params']
//###############################################################

export const updatePartValidator = yup.object({
  params: yup.object({
    partId: objectIdSchema.required(),
  }),
  body: partBodySchema,
})

export type UpdatePartParams = yup.InferType<
  typeof updatePartValidator
>['params']
//###############################################################
