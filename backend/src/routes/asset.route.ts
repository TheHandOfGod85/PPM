import express from 'express'
import * as AssetController from '../controllers/asset.controller'
import { requireAuth, restrictTo } from '../middlewares/requireAuth'
import validateRequestSchema from '../middlewares/validateRequestSchema'
import partRoute from '../routes/part.route'
import {
  createAssetValidator,
  idAssetValidator,
  updateAssetvalidator,
} from '../validation/asset.validator'
import { createPlannedMaintenanceValidator } from './../validation/asset.validator'

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

router
  .route('/:assetId/planned-maintenance')
  .patch(
    requireAuth,
    restrictTo('admin'),
    validateRequestSchema(createPlannedMaintenanceValidator),
    AssetController.createAssetPlannedMaintenance
  )

export default router
