import { RequestHandler } from 'express'
import AssetModel from '../models/asset'
import { AssetDto } from '../dto/dtos'

export const getAssets: RequestHandler = async (req, res, next) => {
  try {
    const allAsseets = await AssetModel.find().exec()
    res.status(200).json(allAsseets)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error })
  }
}

export const createAsset: RequestHandler<
  unknown,
  unknown,
  AssetDto,
  unknown
> = async (req, res, next) => {
  const { name, description, serialNumber } = req.body
  try {
    const newAsset = await AssetModel.create({
      name,
      description,
      serialNumber,
    })
    res.status(201).json(newAsset)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error })
  }
}
