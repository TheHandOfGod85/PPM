import React, { ComponentProps, ReactNode } from 'react'

interface LoadingButtonProps {
  isLoading: boolean
  children: ReactNode
  className?: string
}

export default function LoadingButton({
  isLoading,
  children,
  className,
  ...props
}: LoadingButtonProps & ComponentProps<'button'>) {
  return (
    <button
      {...props}
      disabled={isLoading || props.disabled}
      className={`${className} btn `}
    >
      {isLoading && (
        <>
          <span className="loading loading-dots loading-sm"></span>{' '}
        </>
      )}
      {children}
    </button>
  )
}
