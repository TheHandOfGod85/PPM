import { User } from '@/models/user'
import api from '@/network/axiosInstance'

export async function sendRegistration(email: string, role: string) {
  await api.post('/user/send-registration', {
    email,
    role,
  })
}

interface SignUpValues {
  username: string
  password: string
  about?: string
  displayName?: string
}

export async function SignUp(
  credentials: SignUpValues,
  userId: string | undefined,
  verificationCode: string | undefined
) {
  const response = await api.post<User>('/user/signup', {
    ...credentials,
    userId,
    verificationCode,
  })
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
