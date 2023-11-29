import useSWR from 'swr'
import * as UserApi from '@/network/api/user.api'

export default function useLoggedIn() {
  const { data, mutate, isLoading } = useSWR('isLoggedIn', async () => {
    return await UserApi.isLoggedIn()
  })
  return {
    data,
    isLoading,
    mutate,
  }
}
