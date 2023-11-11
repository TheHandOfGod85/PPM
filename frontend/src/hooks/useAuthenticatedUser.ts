import useSWR from 'swr'
import * as UserApi from '@/network/api/user.api'
import { UnathuorizedError } from '@/network/http-errors'

export default function useAuthenticatedUser() {
  const {
    data: user,
    error,
    isLoading,
    mutate,
  } = useSWR('user', async () => {
    try {
      return await UserApi.getAuthenticatedUser()
    } catch (error) {
      if (error instanceof UnathuorizedError) {
        return null
      } else {
        throw error
      }
    }
  })
  return {
    user,
    userLoading: isLoading,
    userError: error,
    mutateUser: mutate,
  }
}
