export interface Part {
  _id: string
  name: string
  partNumber: string
  description: string
  manufacturer: string
  imageUrl: string
  asset: string
}

export interface PartsPage {
  parts: Part[]
  page: number
  totalPages: number
}
