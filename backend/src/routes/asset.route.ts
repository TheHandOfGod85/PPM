import express from 'express'
import * as AssetController from '../controllers/asset.controller'
import * as TaskController from '../controllers/task.controller'
import * as HistoryController from '../controllers/history.controller'
import { requireAuth, restrictTo } from '../middlewares/requireAuth'
import validateRequestSchema from '../middlewares/validateRequestSchema'
import partRoute from '../routes/part.route'
import {
  addNewTaskValidator,
  addTaskNoteValidator,
  createAssetValidator,
  idAssetValidator,
  idsDeleteTaskValidator,
  toggleCompletedTaskValidator,
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
  .post(
    requireAuth,
    restrictTo('admin'),
    validateRequestSchema(createPlannedMaintenanceValidator),
    AssetController.createAssetPlannedMaintenance
  )

router
  .route('/:assetId/planned-maintenance/addTask')
  .post(
    requireAuth,
    restrictTo('admin'),
    validateRequestSchema(addNewTaskValidator),
    TaskController.addNewTask
  )

router
  .route('/:assetId/:taskId/deleteTask')
  .post(
    requireAuth,
    restrictTo('admin'),
    validateRequestSchema(idsDeleteTaskValidator),
    TaskController.deleteTask
  )
router
  .route('/:assetId/:taskId/updateTask')
  .post(
    requireAuth,
    restrictTo('admin'),
    validateRequestSchema(idsDeleteTaskValidator),
    TaskController.updateTask
  )
router
  .route('/:assetId/updatePlannedMaintenance')
  .post(
    requireAuth,
    restrictTo('admin'),
    validateRequestSchema(createPlannedMaintenanceValidator),
    TaskController.updatePlannedMaintenance
  )
router
  .route('/:assetId/:taskId/toggleCompleted')
  .post(
    requireAuth,
    validateRequestSchema(toggleCompletedTaskValidator),
    TaskController.toggleTaskCompleted
  )
router
  .route('/:assetId/completePlannedMaintenance')
  .post(
    requireAuth,
    validateRequestSchema(idAssetValidator),
    AssetController.completePlannedMaintenance
  )

router
  .route('/:assetId/:taskId/addNote')
  .post(
    requireAuth,
    validateRequestSchema(addTaskNoteValidator),
    TaskController.addTaskNote
  )

router
  .route('/assets/history')
  .get(requireAuth, HistoryController.findHistoryMaintenance)

export default router
