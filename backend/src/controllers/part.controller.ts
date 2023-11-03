import {
  AsseetIdPartParams,
  IdPartParams,
  PartBody,
  UpdatePartParams,
} from './../validation/part.validator'
import { RequestHandler } from 'express'
import PartModel from '../models/part'
import AssetModel from '../models/asset'
import createHttpError from 'http-errors'
import 'express-async-errors'

export const createPartHandler: RequestHandler<
  AsseetIdPartParams,
  unknown,
  PartBody,
  unknown
> = async (req, res) => {
  if (!req.body.asset) req.body.asset = req.params.assetId
  const newPart = await PartModel.create(req.body)
  res.status(201).json(newPart)
}

export const findPartsHandler: RequestHandler<
  AsseetIdPartParams,
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
  const part = await PartModel.findById({ _id: partId })
  if (!part) {
    throw createHttpError(404, `No part found with ID ${partId}`)
  }
  res.status(200).json(part)
}
