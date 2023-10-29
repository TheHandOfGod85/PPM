import express from 'express'
import * as AssetController from '../controllers/asset.controller'
import validateRequestSchema from '../middlewares/validateRequestSchema'
import { createAssetValidator } from '../validation/asset.validator'

const router = express.Router()

router
  .route('/')

  .get(AssetController.findAssetsHandler)
  .post(
    validateRequestSchema(createAssetValidator),
    AssetController.createAssetHandler
  )

router
  .route('/:id')
  .get(AssetController.findAssetHandler)
  .post(AssetController.findByIdAndUpdateHandler)

export default router
