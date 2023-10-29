import express from 'express'
import * as AssetController from '../controllers/asset.controller'
import validateRequestSchema from '../middlewares/validateRequestSchema'
import { createAssetValidator } from '../validation/asset.validator'

const router = express.Router()

router.get('/', AssetController.findAssetsHandler)
router.post(
  '/',
  validateRequestSchema(createAssetValidator),
  AssetController.createAssetHandler
)

export default router
