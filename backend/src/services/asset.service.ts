import { AssetDto } from '../dto/dtos'
import AssetModel from '../models/asset'
import createHttpError from 'http-errors'

export async function create(body: AssetDto) {
  try {
    const existingSerialNumber = await AssetModel.findOne({
      serialNumber: body.serialNumber,
    }).exec()

    if (existingSerialNumber) {
      throw createHttpError(409, 'Serial number already exists')
    }
    return await AssetModel.create(body)
  } catch (error) {
    console.error(error)
  }
}

export async function find() {
  try {
    return await AssetModel.find().exec()
  } catch (error) {
    console.error(error)
  }
}
