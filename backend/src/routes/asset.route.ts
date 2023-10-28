import express from 'express'
import * as AssetController from '../controllers/asset.controller'

const router = express.Router()

router.get('/', AssetController.findAssetsHandler)
router.post('/', AssetController.createAssetHandler)

export default router
