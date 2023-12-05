'use client'
import LoadingSpinner from '@/app/loading'
import useAuthenticatedUser from '@/hooks/useAuthenticatedUser'
import { useRouter } from 'next/navigation'
import React, { ReactNode, useEffect } from 'react'

interface HideRouteProps {
  children: ReactNode
}

export default function HideRoute({ children }: HideRouteProps) {
  const router = useRouter()
  const { user, userLoading } = useAuthenticatedUser()

  useEffect(() => {
    if (user && !userLoading) router.push('/dashboard')
  }, [user, router, userLoading])

  if (userLoading) return <LoadingSpinner />
  if (!user) return children
}
