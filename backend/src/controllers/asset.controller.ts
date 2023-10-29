import { RequestHandler } from 'express'
import AssetModel from '../models/asset'
import mongoose from 'mongoose'
import { AssetBody } from '../validation/asset.validator'

export const findAssetsHandler: RequestHandler = async (req, res, next) => {
  try {
    const allAsseets = await AssetModel.find().exec()

    res.status(200).json(allAsseets)
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
