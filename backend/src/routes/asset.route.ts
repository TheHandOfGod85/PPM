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
import { requireAuth } from '../middlewares/requireAuth'

const router = express.Router()

router.use('/:assetId/part', validateRequestSchema(idAssetValidator), partRoute)

router.route('/ids').get(AssetController.findAssetsIdsHandler)

router
  .route('/')

  .get(requireAuth, AssetController.findAssetsHandler)
  .post(
    requireAuth,
    restrictTo('admin'),
    validateRequestSchema(createAssetValidator),
    AssetController.createAssetHandler
  )

router
  .route('/:assetId')
  .get(
    requireAuth,
    validateRequestSchema(idAssetValidator),
    AssetController.findAssetHandler
  )
  .patch(
    requireAuth,
    restrictTo('admin'),
    validateRequestSchema(updateAssetvalidator),
    AssetController.findByIdAndUpdateAssetHandler
  )
  .delete(
    requireAuth,
    restrictTo('admin'),
    validateRequestSchema(idAssetValidator),
    AssetController.deleteAssetHandler
  )

export default router
