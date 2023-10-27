import express from 'express'
import * as AssetController from '../controllers/asset'

const router = express.Router()

router.get('/', AssetController.getAssets)
router.post('/', AssetController.createAsset)

export default router
