import { updatePartValidator } from './../validation/part.validator'
import express from 'express'
import * as PartController from '../controllers/part.controller'
import validateRequestSchema from '../middlewares/validateRequestSchema'
import {
  assetIdPartValidator,
  createPartValidator,
  idPartValidator,
} from '../validation/part.validator'
import { imageUpload } from '../middlewares/imageUpload'
import { requireAuth, restrictTo } from '../middlewares/requireAuth'

const router = express.Router({ mergeParams: true })

router
  .route('/')
  .get(
    requireAuth,
    validateRequestSchema(assetIdPartValidator),
    PartController.findPartsHandler
  )
  .post(
    requireAuth,
    restrictTo('admin'),
    imageUpload.single('partImage'),
    validateRequestSchema(createPartValidator),
    PartController.createPartHandler
  )

router
  .route('/:partId')
  .get(
    requireAuth,
    validateRequestSchema(idPartValidator),
    PartController.findPartHandler
  )
  .delete(
    requireAuth,
    restrictTo('admin'),
    validateRequestSchema(idPartValidator),
    PartController.deletePartHandler
  )
  .patch(
    requireAuth,
    restrictTo('admin'),
    validateRequestSchema(updatePartValidator),
    PartController.updatePartHandler
  )

export default router
