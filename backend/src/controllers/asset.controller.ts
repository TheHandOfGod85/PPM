import { RequestHandler } from 'express'
import AssetModel from '../models/asset'
import { AssetBody, IdAssetParams } from '../validation/asset.validator'
import createHttpError from 'http-errors'

export const findAssetsHandler: RequestHandler = async (req, res, next) => {
  try {
    const allAsseets = await AssetModel.find().select('-__v').exec()

    res.status(200).json(allAsseets)
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
    const { id } = req.params
    const asset = await AssetModel.findById({ _id: id })
      .populate({
        path: 'parts',
        select: ['name', 'manufacturer', 'partNumber', '-asset'],
      })
      .exec()
    if (!asset) {
      throw createHttpError(404, `No asset found with id ${id}`)
    }
    res.status(200).json(asset)
  } catch (error) {
    next(error)
  }
}

export const findByIdAndUpdateHandler: RequestHandler<
  IdAssetParams,
  unknown,
  AssetBody,
  unknown
> = async (req, res, next) => {
  const { id } = req.params
  try {
    const asset = await AssetModel.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    }).select(['-__v'])
    if (!asset) {
      throw createHttpError(404, `No asset found with id ${id}`)
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
  const { id } = req.params
  try {
    const asset = await AssetModel.findById({ _id: id }).select(['-__v'])
    if (!asset) {
      throw createHttpError(404, `No asset found with id ${id}`)
    }
    await asset.deleteOne()
    res.sendStatus(204)
  } catch (error) {
    next(error)
  }
}
