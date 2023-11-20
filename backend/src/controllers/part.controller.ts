import {
  AssetIdPartParams,
  GetPartsQuery,
  IdPartParams,
  PartBody,
  UpdatePartParams,
} from './../validation/part.validator'
import { RequestHandler } from 'express'
import PartModel from '../models/part'
import AssetModel from '../models/asset'
import createHttpError from 'http-errors'
import 'express-async-errors'
import mongoose, { Model } from 'mongoose'
import sharp from 'sharp'
import env from '../env'
import { search } from '../utils/search'
import fs from 'fs'

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
  GetPartsQuery
> = async (req, res) => {
  let filter = {}
  if (req.params.assetId)
    filter = { asset: new mongoose.Types.ObjectId(req.params.assetId) }
  const asset = await AssetModel.findOne({ _id: req.params.assetId })
  if (!asset) {
    throw createHttpError(404, `No asset found with ID ${req.params.assetId}`)
  }
  const getPartsQuery = await search(
    PartModel as Model<unknown>,
    req.query,
    3,
    filter
  )
  const parts = await getPartsQuery.result

  res.status(200).json({
    parts,
    page: getPartsQuery.page,
    totalPages: getPartsQuery.totalpages,
  })
}

export const deletePartHandler: RequestHandler<
  IdPartParams,
  unknown,
  unknown,
  unknown
> = async (req, res) => {
  const { partId } = req.params
  const part = await PartModel.findById(partId).exec()
  if (!part) {
    throw createHttpError(404, `No part found with ID ${req.params.partId}`)
  }
  if (part.imageUrl?.startsWith(env.SERVER_URL)) {
    const imagePath = part.imageUrl.split(env.SERVER_URL)[1].split('?')[0]
    fs.unlinkSync(`.${imagePath}`)
  }
  await part.deleteOne()
  res.sendStatus(204)
}

export const updatePartHandler: RequestHandler<
  UpdatePartParams,
  unknown,
  PartBody,
  unknown
> = async (req, res) => {
  const { partId } = req.params
  const { name, manufacturer, partNumber, description } = req.body
  const partImage = req.file
  const part = await PartModel.findById(partId).exec()
  if (!part) {
    throw createHttpError(404, `No part found with Id ${partId}`)
  }
  if (part.imageUrl && partImage) {
    const previousImagePath = part.imageUrl
      .replace(`${env.SERVER_URL}`, '')
      .split('?')[0]
    fs.unlinkSync(`.${previousImagePath}`)
  }
  part.name = name
  part.description = description
  part.manufacturer = manufacturer
  part.partNumber = partNumber
  if (partImage) {
    const fileName = partImage?.originalname.replace(/\.[^/.]+$/, '')
    const partImagePath = `/uploads/part-images/${fileName}-${partId}.png`
    await sharp(partImage?.buffer).resize(700, 450).toFile(`./${partImagePath}`)
    part.imageUrl =
      env.SERVER_URL + partImagePath + '?lastupdated=' + Date.now()
  }
  await part.save()
  res.sendStatus(200)
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
