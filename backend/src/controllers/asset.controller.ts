import { RequestHandler } from 'express'
import AssetModel from '../models/asset'
import mongoose from 'mongoose'
import { AssetBody } from '../validation/asset.validator'
import createHttpError from 'http-errors'

export const findAssetsHandler: RequestHandler = async (req, res, next) => {
  try {
    const allAsseets = await AssetModel.find().exec()

    res.status(200).json(allAsseets)
  } catch (error) {
    next(error)
  }
}

export const findAssetHandler: RequestHandler = async (req, res, next) => {
  try {
    const _id = req.params.id
    const asset = await AssetModel.findById({ _id })
    if (!asset) {
      throw createHttpError(404, `No asset found with id ${_id}`)
    }
    res.status(200).json(asset)
  } catch (error) {
    next(error)
  }
}

export const findByIdAndUpdateHandler: RequestHandler<
  { id: string },
  unknown,
  AssetBody,
  unknown
> = async (req, res, next) => {
  const { id } = req.params
  try {
    const asset = await AssetModel.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    })
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
  const { name, description, serialNumber } = req.body
  const _id = new mongoose.Types.ObjectId()

  try {
    const newAsset = await AssetModel.create({
      _id,
      name,
      description,
      serialNumber,
    })
    res.status(201).json(newAsset)
  } catch (error) {
    next(error)
  }
}

// TODO deleteAssetHandler
