import useAuthenticatedUser from '@/hooks/useAuthenticatedUser'
import { User } from '@/models/user'
import { UnauthorisedError } from '@/network/http-errors'
import { ReactNode, createContext, useContext } from 'react'
import React from 'react'
import { KeyedMutator, mutate } from 'swr'

interface UserContextProps {
  user: User | null | undefined
  userLoading: boolean
  userError?: Error | UnauthorisedError | null
  mutateUser: KeyedMutator<User | null>
}

const UserContext = createContext<UserContextProps | undefined>(undefined)

export function useUser(): UserContextProps {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

interface UserProviderProps {
  children: ReactNode
}

export function UserProvider({ children }: UserProviderProps): JSX.Element {
  const { user, userError, mutateUser, userLoading } = useAuthenticatedUser()

  const value: UserContextProps = {
    user,
    userError,
    mutateUser,
    userLoading,
  }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}
