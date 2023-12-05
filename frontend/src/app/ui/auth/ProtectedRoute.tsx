'use client'
import LoadingSpinner from '@/app/loading'
import useAuthenticatedUser from '@/hooks/useAuthenticatedUser'
import { useRouter } from 'next/navigation'
import React, { ReactNode, useEffect } from 'react'

interface ProtectedRouteProps {
  children: ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter()
  const { user, userLoading } = useAuthenticatedUser()

  useEffect(() => {
    if (!user && !userLoading) router.push('/')
  }, [user, router, userLoading])

  if (userLoading) return <LoadingSpinner />
  if (user) return children
}
