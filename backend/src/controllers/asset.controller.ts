import { RequestHandler } from 'express'
import 'express-async-errors'
import createHttpError from 'http-errors'
import AssetModel from '../models/asset'
import { APIfeatures } from '../utils/apiFeatures'
import { AssetBody, IdAssetParams } from '../validation/asset.validator'
import { GetAssetsQuery } from './../validation/asset.validator'

export const findAssetsHandler: RequestHandler<
  unknown,
  unknown,
  unknown,
  GetAssetsQuery
> = async (req, res) => {
  const getAssetsQuery = new APIfeatures(AssetModel.find(), req.query)
    .filtering()
    .sort()
    .paginate()

  const countAssetsQuery = AssetModel.countDocuments().exec()
  const [assets, totalAssets] = await Promise.all([
    getAssetsQuery.query,
    countAssetsQuery,
  ])
  const totalPages = Math.ceil(totalAssets / getAssetsQuery.pageSize)
  res.status(200).json({
    assets,
    page: getAssetsQuery.page,
    totalPages,
  })
}
export const findAssetsIdsHandler: RequestHandler = async (req, res) => {
  const results = await AssetModel.find().select('-__v _id').exec()
  const ids = results.map((asset) => asset._id)
  res.status(200).json(ids)
}

export const findAssetHandler: RequestHandler<
  IdAssetParams,
  unknown,
  unknown,
  unknown
> = async (req, res) => {
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
    .exec()
  if (!asset) {
    throw createHttpError(404, `No asset found with id ${assetId}`)
  }
  res.status(200).json(asset)
}

export const findByIdAndUpdateAssetHandler: RequestHandler<
  IdAssetParams,
  unknown,
  AssetBody,
  unknown
> = async (req, res) => {
  const { assetId } = req.params

  const asset = await AssetModel.findByIdAndUpdate({ _id: assetId }, req.body, {
    new: true,
    runValidators: true,
  }).select(['-__v'])
  if (!asset) {
    throw createHttpError(404, `No asset found with id ${assetId}`)
  }
  res.status(200).json(asset)
}

export const createAssetHandler: RequestHandler<
  unknown,
  unknown,
  AssetBody,
  unknown
> = async (req, res) => {
  const newAsset = await AssetModel.create(req.body)
  res.status(201).json(newAsset)
}

export const deleteAssetHandler: RequestHandler<
  IdAssetParams,
  unknown,
  unknown,
  unknown
> = async (req, res) => {
  const { assetId } = req.params

  const asset = await AssetModel.findById({ _id: assetId }).select(['-__v'])
  if (!asset) {
    throw createHttpError(404, `No asset found with id ${assetId}`)
  }
  await asset.deleteOne()
  res.sendStatus(204)
}
