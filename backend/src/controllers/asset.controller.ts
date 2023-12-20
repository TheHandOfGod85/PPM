import { RequestHandler } from 'express'
import createHttpError from 'http-errors'
import { Model } from 'mongoose'
import AssetModel from '../models/asset'
import HistoryModel from '../models/history-maintenance'
import calculateNextMaintenanceDate from '../utils/calculatetNextMaintenanceDate'
import { search } from '../utils/search'
import {
  AssetBody,
  IdAssetParams,
  PlannedMaintenanceBody,
} from '../validation/asset.validator'
import { GetAssetsQuery } from './../validation/asset.validator'

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
      .populate({
        path: 'history',
        select: ['completedDate', 'completedTasks'],
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

export const completePlannedMaintenance: RequestHandler<
  IdAssetParams,
  unknown,
  unknown,
  unknown
> = async (req, res, next) => {
  try {
    const { assetId } = req.params

    const asset = await AssetModel.findOne({ _id: assetId })

    if (!asset) {
      throw createHttpError(404, `No asset found with id ${assetId}`)
    }

    const previousInterval = asset?.plannedMaintenance?.interval

    const convertedDate = new Date(Date.now())

    const nextMaintenanceDate = calculateNextMaintenanceDate(
      convertedDate,
      previousInterval as number
    )

    await asset?.updateOne({
      $set: {
        'plannedMaintenance.startDate': nextMaintenanceDate,
      },
    })

    await HistoryModel.create({
      asset: asset._id,
      completedTasks: asset.plannedMaintenance?.tasks,
    })

    await asset.save()

    asset.plannedMaintenance?.tasks.forEach((task) => {
      task.note = undefined
      task.completed = false
    })
    await asset.save()

    res.status(200).json(asset)
  } catch (error) {
    next(error)
  }
}
