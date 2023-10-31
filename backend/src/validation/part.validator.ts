import * as yup from 'yup'
import { objectIdSchema } from '../utils/validators'

//###############################################################
const partBodySchema = yup.object({
  name: yup.string().required().max(100),
  description: yup.string().max(500),
  partNumber: yup.string().required(),
  asset: objectIdSchema.required(),
})
export type PartBody = yup.InferType<typeof partBodySchema>
//###############################################################

export const createPartValidator = yup.object({
  body: partBodySchema,
})
//###############################################################
export const idPartValidator = yup.object({
  params: yup.object({
    id: objectIdSchema.required(),
  }),
})

export type IdPartParams = yup.InferType<typeof idPartValidator>['params']
//###############################################################
