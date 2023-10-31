import express from 'express'
import * as AssetController from '../controllers/asset.controller'
import validateRequestSchema from '../middlewares/validateRequestSchema'
import {
  createAssetValidator,
  idAssetValidator,
  updateAssetvalidator,
} from '../validation/asset.validator'

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
  .get(
    validateRequestSchema(idAssetValidator),
    AssetController.findAssetHandler
  )
  .post(
    validateRequestSchema(updateAssetvalidator),
    AssetController.findByIdAndUpdateHandler
  )
  .delete(
    validateRequestSchema(idAssetValidator),
    AssetController.deleteAssetHandler
  )

export default router
