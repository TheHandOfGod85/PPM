import { User } from '@/models/user'
import api from '@/network/axiosInstance'

interface SignUpValues {
  username: string
  email: string
  password: string
  role?: string
}

export async function SignUp(credentials: SignUpValues) {
  const response = await api.post<User>('/user/signup', credentials)
  return response.data
}

interface LoginValues {
  username: string
  password: string
}

export async function login(credentials: LoginValues) {
  const response = await api.post<User>('/user/login', credentials)
  return response.data
}

export async function getAuthenticatedUser(cookie?: string) {
  const response = await api.get<User>('/user/me', {
    headers: { Cookie: cookie },
  })
  return response.data
}

export async function getAllUsers(cookie?: string) {
  const response = await api.get<User[]>('/user/allUsers', {
    headers: { Cookie: cookie },
  })
  return response.data
}

export async function logout() {
  await api.post('/user/logout')
}
