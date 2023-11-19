import { PartsPage } from '@/models/part'
import api from '@/network/axiosInstance'

export async function getPartsByAssetId(
  page: number = 1,
  assetId: string,
  filter?: string,
  cookie?: string
) {
  if (filter && page) {
    const response = await api.get<PartsPage>(
      `/assets/${assetId}/part?search=${filter}&page=${page}`,
      { headers: { Cookie: cookie } }
    )
    return response.data
  }
  const response = await api.get<PartsPage>(
    `/assets/${assetId}/part?page=${page}`,
    { headers: { Cookie: cookie } }
  )
  return response.data
}
