import { updatePartValidator } from './../validation/part.validator'
import express from 'express'
import * as PartController from '../controllers/part.controller'
import validateRequestSchema from '../middlewares/validateRequestSchema'
import {
  assetIdPartValidator,
  createPartValidator,
  idPartValidator,
} from '../validation/part.validator'

const router = express.Router({ mergeParams: true })

router
  .route('/')
  .get(
    validateRequestSchema(assetIdPartValidator),
    PartController.findPartsHandler
  )
  .post(
    validateRequestSchema(createPartValidator),
    PartController.createPartHandler
  )

router
  .route('/:partId')
  .get(validateRequestSchema(idPartValidator), PartController.findPartHandler)
  .delete(
    validateRequestSchema(assetIdPartValidator),
    validateRequestSchema(idPartValidator),
    PartController.deletePartHandler
  )
  .patch(
    validateRequestSchema(updatePartValidator),
    PartController.updatePartHandler
  )

export default router
