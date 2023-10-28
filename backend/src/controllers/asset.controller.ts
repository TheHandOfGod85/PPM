import { RequestHandler } from 'express'
import { AssetDto } from '../dto/dtos'
import { create, find } from '../services/asset.service'

export const findAssetsHandler: RequestHandler = async (req, res, next) => {
  try {
    const allAsseets = await find()

    res.status(200).json(allAsseets)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error })
  }
}

export const createAssetHandler: RequestHandler<
  unknown,
  unknown,
  AssetDto,
  unknown
> = async (req, res, next) => {
  const { name, description, serialNumber } = req.body
  try {
    const newAsset = await create({
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
