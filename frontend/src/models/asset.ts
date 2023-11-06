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
