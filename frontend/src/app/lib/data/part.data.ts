import { Part, PartsPage } from '@/models/part'
import api from '@/app/lib/axiosInstance'

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

export async function getPartById(partId: string, cookie?: string) {
  const response = await api.get<Part>(`/part/${partId}`, {
    headers: { Cookie: cookie },
  })
  return response.data
}

interface CreatePartValues {
  name: string
  description?: string
  partNumber: string
  manufacturer: string
  partImage?: File
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

interface UpdatePartValues {
  name: string
  description?: string
  partNumber: string
  manufacturer: string
  partImage?: File
}

export async function updatePartAsset(input: UpdatePartValues, partId: string) {
  const formData = new FormData()
  Object.entries(input).forEach(([key, value]) => {
    formData.append(key, value)
  })
  await api.patch(`/part/${partId}`, formData)
}

export async function deletePartAsset(partId: string) {
  await api.delete(`/part/${partId}`)
}
