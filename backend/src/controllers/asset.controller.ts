import { RequestHandler } from 'express'
import createHttpError from 'http-errors'
import AssetModel from '../models/asset'
import {
  AddNewTaskBody,
  AssetBody,
  IdAssetParams,
  IdsDeleteTaskParams,
  PlannedMaintenanceBody,
} from '../validation/asset.validator'
import { GetAssetsQuery } from './../validation/asset.validator'
import { search } from '../utils/search'
import { Model } from 'mongoose'
import calculateNextMaintenanceDate from '../utils/calculatetNextMaintenanceDate'

export const findAssetsHandler: RequestHandler<
  unknown,
  unknown,
  unknown,
  GetAssetsQuery
> = async (req, res, next) => {
  try {
    const getAssetsQuery = await search(AssetModel as Model<unknown>, req.query)
    const assets = await getAssetsQuery.result

    res.status(200).json({
      assets,
      page: getAssetsQuery.page,
      totalPages: getAssetsQuery.totalpages,
    })
  } catch (error) {
    next(error)
  }
}
export const findAssetsIdsHandler: RequestHandler = async (req, res, next) => {
  try {
    const results = await AssetModel.find().select('-__v _id').exec()
    const ids = results.map((asset) => asset._id)
    res.status(200).json(ids)
  } catch (error) {
    next(error)
  }
}

export const findAssetHandler: RequestHandler<
  IdAssetParams,
  unknown,
  unknown,
  unknown
> = async (req, res, next) => {
  try {
    const { assetId } = req.params
    const asset = await AssetModel.findById({ _id: assetId })
      .populate({
        path: 'parts',
        select: [
          'name',
          'manufacturer',
          'partNumber',
          '-asset',
          'description',
          'imageUrl',
        ],
      })
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

export const findByIdAndUpdateAssetHandler: RequestHandler<
  IdAssetParams,
  unknown,
  AssetBody,
  unknown
> = async (req, res, next) => {
  try {
    const { assetId } = req.params

    const asset = await AssetModel.findByIdAndUpdate(
      { _id: assetId },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    ).select(['-__v'])
    if (!asset) {
      throw createHttpError(404, `No asset found with id ${assetId}`)
    }
    res.status(200).json(asset)
  } catch (error) {
    next(error)
  }
}

export const createAssetHandler: RequestHandler<
  unknown,
  unknown,
  AssetBody,
  unknown
> = async (req, res, next) => {
  try {
    const newAsset = await AssetModel.create(req.body)
    res.status(201).json(newAsset)
  } catch (error) {
    next(error)
  }
}

export const deleteAssetHandler: RequestHandler<
  IdAssetParams,
  unknown,
  unknown,
  unknown
> = async (req, res, next) => {
  try {
    const { assetId } = req.params

    const asset = await AssetModel.findById({ _id: assetId }).select(['-__v'])
    if (!asset) {
      throw createHttpError(404, `No asset found with id ${assetId}`)
    }
    await asset.deleteOne()
    res.sendStatus(204)
  } catch (error) {
    next(error)
  }
}

export const createAssetPlannedMaintenance: RequestHandler<
  IdAssetParams,
  unknown,
  PlannedMaintenanceBody,
  unknown
> = async (req, res, next) => {
  try {
    const { assetId } = req.params
    const { startDate, interval, task } = req.body

    const convertedDate = new Date(startDate as Date)

    const nextMaintenanceDate = calculateNextMaintenanceDate(
      convertedDate,
      interval as number
    )

    const asset = await AssetModel.findByIdAndUpdate(assetId, {
      $set: {
        'plannedMaintenance.startDate': nextMaintenanceDate,
        'plannedMaintenance.interval': interval,
      },
      $push: { 'plannedMaintenance.tasks': task },
    })
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
  IdsDeleteTaskParams,
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
  IdsDeleteTaskParams,
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
