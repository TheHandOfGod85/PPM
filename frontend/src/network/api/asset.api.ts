import { Asset } from '@/models/asset'
import { Part } from '@/models/part'
import api from '@/network/axiosInstance'

export async function getAssets() {
  const response = await api.get<Asset[]>('/assets')
  return response.data
}

export async function getAsset(assetId: string) {
  const response = await api.get<Asset>(`/assets/${assetId}`)
  return response.data
}

export async function getAllAssetsIds() {
  const response = await api.get<string[]>('/assets/ids')
  return response.data
}

interface CreatePartValues {
  name: string
  description: string
  partNumber: string
  manufacturer: string
  partImage: File
}

export async function createPartAsset(
  input: CreatePartValues,
  assetId: string
) {
  const formData = new FormData()
  Object.entries(input).forEach(([key, value]) => {
    formData.append(key, value)
  })
  const response = await api.post<Part>(`/assets/${assetId}/part`, formData)
  return response.data
}

interface CreateAssetValues {
  name: string
  description: string
  serialNumber: string
}
export async function createAsset(input: CreateAssetValues) {
  const response = await api.post<Asset>('/assets', input)
  return response.data
}
