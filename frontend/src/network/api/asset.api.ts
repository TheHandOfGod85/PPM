import { Asset, AssetsPage } from '@/models/asset'
import api from '@/network/axiosInstance'

export async function getAssets(
  page?: number,
  filter?: string,
  cookie?: string
) {
  if (filter && page) {
    const response = await api.get<AssetsPage>(
      `/assets?search=${filter}&page=${page}`,
      {
        headers: { Cookie: cookie },
      }
    )
    return response.data
  }
  const response = await api.get<AssetsPage>(`/assets?page=${page}`, {
    headers: { Cookie: cookie },
  })
  return response.data
}

export async function getAsset(assetId: string, cookie?: string) {
  const response = await api.get<Asset>(`/assets/${assetId}`, {
    headers: { Cookie: cookie },
  })
  return response.data
}

export async function getAllAssetsIds() {
  const response = await api.get<string[]>('/assets/ids')
  return response.data
}



interface CreateAssetValues {
  name: string
  description?: string
  serialNumber: string
}
export async function createAsset(input: CreateAssetValues) {
  const response = await api.post<Asset>('/assets', input)
  return response.data
}
