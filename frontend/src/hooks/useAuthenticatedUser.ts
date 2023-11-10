import useSWR from 'swr'
import * as UserApi from '@/network/api/user.api'

export default function useAuthenticatedUser() {
  const {
    data: user,
    error,
    isLoading,
    mutate,
  } = useSWR('user', UserApi.getAuthenticatedUser)
  return {
    user,
    userLoading: isLoading,
    userError: error,
    mutateUser: mutate,
  }
}
