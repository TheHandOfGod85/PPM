import express from 'express'
import * as AssetController from '../controllers/asset.controller'
import validateRequestSchema from '../middlewares/validateRequestSchema'
import {
  createAssetValidator,
  idAssetValidator,
  updateAssetvalidator,
} from '../validation/asset.validator'
import partRoute from '../routes/part.route'
import { restrictTo } from '../middlewares/requireAuth'

const router = express.Router()

router.use('/:assetId/part', partRoute)

router
  .route('/')

  .get(AssetController.findAssetsHandler)
  .post(
    // restrictTo('admin'),
    validateRequestSchema(createAssetValidator),
    AssetController.createAssetHandler
  )

router
  .route('/:assetId')
  .get(
    validateRequestSchema(idAssetValidator),
    AssetController.findAssetHandler
  )
  .patch(
    // restrictTo('admin'),
    validateRequestSchema(updateAssetvalidator),
    AssetController.findByIdAndUpdateAssetHandler
  )
  .delete(
    // restrictTo('admin'),
    validateRequestSchema(idAssetValidator),
    AssetController.deleteAssetHandler
  )

export default router
