import {
  AssetIdPartParams,
  IdPartParams,
  PartBody,
  UpdatePartParams,
} from './../validation/part.validator'
import { RequestHandler } from 'express'
import PartModel from '../models/part'
import AssetModel from '../models/asset'
import createHttpError from 'http-errors'
import 'express-async-errors'
import mongoose from 'mongoose'
import sharp from 'sharp'
import env from '../env'

export const createPartHandler: RequestHandler<
  AssetIdPartParams,
  unknown,
  PartBody,
  unknown
> = async (req, res) => {
  const assetId = req.params.assetId
  const asset = await AssetModel.findOne({ _id: assetId })
  if (!asset) {
    throw createHttpError(404, `No asset found with ID ${assetId}`)
  }
  let newPart
  const { manufacturer, name, partNumber, description } = req.body
  const partImage = req.file
  const partId = new mongoose.Types.ObjectId()
  const fileName = partImage?.originalname.replace(/\.[^/.]+$/, '')
  if (partImage) {
    const partImagePath = `/uploads/part-images/${fileName}-${partId}.png`
    await sharp(partImage?.buffer).resize(700, 450).toFile(`./${partImagePath}`)
    newPart = await PartModel.create({
      _id: partId,
      name,
      description,
      partNumber,
      manufacturer,
      asset: assetId,
      imageUrl: `${env.SERVER_URL}${partImagePath}`,
    })
  } else {
    newPart = await PartModel.create({
      _id: partId,
      name,
      description,
      partNumber,
      manufacturer,
      asset: assetId,
    })
  }

  res.status(201).json(newPart)
}

export const findPartsHandler: RequestHandler<
  AssetIdPartParams,
  unknown,
  unknown,
  unknown
> = async (req, res) => {
  let filter = {}
  if (req.params.assetId) filter = { asset: req.params.assetId }
  const asset = await AssetModel.findOne({ _id: req.params.assetId })
  if (!asset) {
    throw createHttpError(404, `No asset found with ID ${req.params.assetId}`)
  }
  const allParts = await PartModel.find(filter).select({ asset: 0 })
  res.status(200).json(allParts)
}

export const deletePartHandler: RequestHandler<
  IdPartParams,
  unknown,
  unknown,
  unknown
> = async (req, res) => {
  const part = await PartModel.findByIdAndDelete(req.params.partId)
  if (!part) {
    throw createHttpError(404, `No part found with ID ${req.params.partId}`)
  }
  res.sendStatus(204)
}

export const updatePartHandler: RequestHandler<
  UpdatePartParams,
  unknown,
  PartBody,
  unknown
> = async (req, res) => {
  const { partId } = req.params
  const part = await PartModel.findByIdAndUpdate({ _id: partId }, req.body, {
    new: true,
    runValidators: true,
    select: { asset: 0 },
  })
  if (!part) {
    throw createHttpError(404, `No part found with Id ${partId}`)
  }
  res.status(200).json(part)
}
export const findPartHandler: RequestHandler<
  IdPartParams,
  unknown,
  unknown,
  unknown
> = async (req, res) => {
  const { partId } = req.params
  const part = await PartModel.findOne({ _id: partId })
  if (!part) {
    throw createHttpError(404, `No part found with ID ${partId}`)
  }
  res.status(200).json(part)
}
