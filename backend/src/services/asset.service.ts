import { AssetDto } from '../dto/dtos'
import AssetModel from '../models/asset'

export async function create(body: AssetDto) {
  return AssetModel.create(body)
}

export async function find() {
  return await AssetModel.find().exec()
}
