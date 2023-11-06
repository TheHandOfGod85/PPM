import React, { ComponentProps, ReactNode } from 'react'

interface LoadingButtonProps {
  isLoading: boolean
  children: ReactNode
}

export default function LoadingButton({
  isLoading,
  children,
  ...props
}: LoadingButtonProps & ComponentProps<'button'>) {
  return (
    <button {...props} className="btn btn-neutral mt-4">
      {isLoading && (
        <>
          <span className="loading loading-dots loading-sm"></span>{' '}
        </>
      )}
      {children}
    </button>
  )
}
