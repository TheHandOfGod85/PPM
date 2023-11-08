import { User } from '@/models/user'
import api from '@/network/axiosInstance'

interface SignUpValues {
  username: string
  email: string
  password: string
}

export async function SignUpValues(credentials: SignUpValues) {
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
