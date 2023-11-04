import { Asset } from '@/models/asset'
import api from '@/network/axiosInstance'

interface CreateAssetValues {
  name: string
  description: string
  serialNumber: string
}
export async function CreateAsset(input: CreateAssetValues) {
  const response = await api.post<Asset>('/assets', input)
  return response.data
}
