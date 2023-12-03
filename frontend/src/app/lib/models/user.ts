export interface User {
  _id: string
  username: string
  email: string
  displayName: string
  about: string
  role: string
  verified: boolean
  createdAt: string
  updatedAt: string
  token?: [{ createdAt: string }]
}
