import { Part } from './part'

export interface Asset {
  _id: string
  name: string
  description: string
  serialNumber: string
  parts: Part[]
  createdAt: string
  updatedAt: string
}

export interface AssetsPage {
  assets: Asset[]
  page: number
  totalPages: number
}
