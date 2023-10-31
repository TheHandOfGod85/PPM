import express from 'express'
import * as PartController from '../controllers/part.controller'
import validateRequestSchema from '../middlewares/validateRequestSchema'
import { createAssetValidator } from '../validation/asset.validator'

const router = express.Router()

router
  .route('/')
  .post(
    validateRequestSchema(createAssetValidator),
    PartController.createPartHandler
  )
  .get(PartController.findPartsHandler)

export default router
