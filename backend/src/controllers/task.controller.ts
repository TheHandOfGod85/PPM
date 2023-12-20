import { RequestHandler } from 'express'
import createHttpError from 'http-errors'
import calculateNextMaintenanceDate from '../utils/calculatetNextMaintenanceDate'
import {
  IdAssetParams,
  AddNewTaskBody,
  IdsTaskParams,
  PlannedMaintenanceBody,
  AddTaskNote,
} from '../validation/asset.validator'
import AssetModel from '../models/asset'

export const addNewTask: RequestHandler<
  IdAssetParams,
  unknown,
  AddNewTaskBody,
  unknown
> = async (req, res, next) => {
  try {
    const { assetId } = req.params
    const { task } = req.body

    const asset = await AssetModel.findByIdAndUpdate(
      assetId,
      {
        $push: { 'plannedMaintenance.tasks': task },
      },
      {
        new: true,
        runValidators: true,
      }
    )
      .populate({
        path: 'plannedMaintenance.tasks',
      })
      .exec()

    if (!asset) {
      throw createHttpError(404, `No asset found with id ${assetId}`)
    }
    res.status(200).json(asset)
  } catch (error) {
    next(error)
  }
}
export const deleteTask: RequestHandler<
  IdsTaskParams,
  unknown,
  unknown,
  unknown
> = async (req, res, next) => {
  try {
    const { assetId, taskId } = req.params

    const existingTask = await AssetModel.findOne({
      _id: assetId,
      'plannedMaintenance.tasks._id': taskId,
    })

    if (!existingTask) {
      throw createHttpError(404, `No task found with id ${taskId}`)
    }

    const asset = await AssetModel.findByIdAndUpdate(
      assetId,
      {
        $pull: { 'plannedMaintenance.tasks': { _id: taskId } },
      },
      {
        new: true,
        runValidators: true,
      }
    )
      .populate({
        path: 'plannedMaintenance.tasks',
      })
      .exec()

    if (!asset) {
      throw createHttpError(404, `No asset found with id ${assetId}`)
    }
    res.sendStatus(204)
  } catch (error) {
    next(error)
  }
}
export const updateTask: RequestHandler<
  IdsTaskParams,
  unknown,
  PlannedMaintenanceBody,
  unknown
> = async (req, res, next) => {
  try {
    const { assetId, taskId } = req.params

    const { task } = req.body

    const assetToUpdate = await AssetModel.findOne({
      _id: assetId,
      'plannedMaintenance.tasks._id': taskId,
    }).exec()

    if (!assetToUpdate) {
      throw createHttpError(404, `No asset or task found.`)
    }

    const asset = await AssetModel.findOneAndUpdate(
      {
        _id: assetId,
        'plannedMaintenance.tasks._id': taskId,
      },
      {
        $set: {
          'plannedMaintenance.tasks.$': { ...task, _id: taskId },
        },
      },
      {
        new: true,
        runValidators: true,
      }
    )
      .populate({
        path: 'plannedMaintenance.tasks',
      })
      .exec()

    res.status(200).json(asset)
  } catch (error) {
    next(error)
  }
}

export const updatePlannedMaintenance: RequestHandler<
  IdAssetParams,
  unknown,
  PlannedMaintenanceBody,
  unknown
> = async (req, res, next) => {
  try {
    const { assetId } = req.params

    const { interval, startDate } = req.body

    const convertedDate = new Date(startDate as Date)

    const nextMaintenanceDate = calculateNextMaintenanceDate(
      convertedDate,
      interval ? interval : 1
    )

    const asset = await AssetModel.findOneAndUpdate(
      {
        _id: assetId,
      },
      {
        $set: {
          'plannedMaintenance.interval': interval ? interval : 1,
          'plannedMaintenance.startDate': nextMaintenanceDate,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    )
      .populate({
        path: 'plannedMaintenance.tasks',
      })
      .exec()

    if (!asset) {
      throw createHttpError(404, `No asset found with id ${assetId}`)
    }
    res.status(200).json(asset)
  } catch (error) {
    next(error)
  }
}

export const toggleTaskCompleted: RequestHandler<
  IdsTaskParams,
  unknown,
  unknown,
  unknown
> = async (req, res, next) => {
  try {
    const { assetId, taskId } = req.params

    const assetToUpdate = await AssetModel.findOne({
      _id: assetId,
      'plannedMaintenance.tasks._id': taskId,
    })
      .populate({
        path: 'plannedMaintenance.tasks',
      })
      .exec()

    if (!assetToUpdate) {
      throw createHttpError(404, `No asset or task found.`)
    }

    const task = assetToUpdate.plannedMaintenance?.tasks.find(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (task: any) => task._id.toString() === taskId
    )

    const asset = await AssetModel.findOneAndUpdate(
      {
        _id: assetId,
        'plannedMaintenance.tasks._id': taskId,
      },
      {
        $set: {
          'plannedMaintenance.tasks.$.completed': !task?.completed,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    )
      .populate({
        path: 'plannedMaintenance.tasks',
      })
      .exec()

    res.status(200).json(asset)
  } catch (error) {
    next(error)
  }
}

export const addTaskNote: RequestHandler<
  IdsTaskParams,
  unknown,
  AddTaskNote,
  unknown
> = async (req, res, next) => {
  const { assetId, taskId } = req.params
  const { note } = req.body

  try {
    const assetToUpdate = await AssetModel.findOne({
      _id: assetId,
      'plannedMaintenance.tasks._id': taskId,
    })
      .populate({
        path: 'plannedMaintenance.tasks',
      })
      .exec()

    if (!assetToUpdate) {
      throw createHttpError(404, `No asset or task found.`)
    }

    const asset = await AssetModel.findOneAndUpdate(
      {
        _id: assetId,
        'plannedMaintenance.tasks._id': taskId,
      },
      {
        $set: {
          'plannedMaintenance.tasks.$.note': note,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    )
      .populate({
        path: 'plannedMaintenance.tasks',
      })
      .exec()

    res.status(200).json(asset)
  } catch (error) {
    next(error)
  }
}
