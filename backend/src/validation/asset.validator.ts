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
    search: yup.string(),
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

export const plannedMaintenanceBodyValidator = yup.object({
  startDate: yup.date().required(),
  interval: yup.number().required(),
  task: yup.object({
    name: yup.string(),
    description: yup.string(),
  }),
})
export type PlannedMaintenanceBody = yup.InferType<
  typeof plannedMaintenanceBodyValidator
>
//###############################################################
export const createPlannedMaintenanceValidator = yup.object({
  params: yup.object({
    _id: objectIdSchema,
  }),
  body: plannedMaintenanceBodyValidator,
})

export type CreatePlannedMaintenance = yup.InferType<
  typeof createPlannedMaintenanceValidator
>
//###############################################################
export const idsDeleteTaskValidator = yup.object({
  params: yup.object({
    assetId: objectIdSchema,
    taskId: objectIdSchema,
  }),
})

export type IdsDeleteTaskParams = yup.InferType<
  typeof idsDeleteTaskValidator
>['params']
//###############################################################
export const addNewTaskValidator = yup.object({
  params: yup.object({
    assetId: objectIdSchema,
  }),
  task: yup.object({
    name: yup.string(),
    description: yup.string(),
  }),
})
export type AddNewTaskBody = yup.InferType<typeof addNewTaskValidator>
//###############################################################
export const toggleCompletedTaskValidator = yup.object({
  params: yup.object({
    taskId: objectIdSchema,
    assetId: objectIdSchema,
  }),
  task: yup.object({
    completed: yup.bool(),
  }),
})
export type ToggleCompletedTask = yup.InferType<
  typeof toggleCompletedTaskValidator
>
