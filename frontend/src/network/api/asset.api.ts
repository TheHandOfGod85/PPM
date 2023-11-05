import { Asset } from '@/models/asset'
import api from '@/network/axiosInstance'

export async function getAssets() {
  const response = await api.get<Asset[]>('/assets')
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
