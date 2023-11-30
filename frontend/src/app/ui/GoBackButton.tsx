import Link from 'next/link'
import React, { ComponentProps } from 'react'
interface GoBackButtonProps {
  href?: string
  buttonName?: string
}

export default function GoBackButton({
  href,
  buttonName,
  ...props
}: GoBackButtonProps & ComponentProps<'button'>) {
  const isHref = href ? (
    <Link href={href}>
      <button {...props} className="btn btn-primary mt-2 btn-sm">
        {buttonName ? buttonName : 'go back'}
      </button>
    </Link>
  ) : (
    <button {...props} className="btn btn-primary mt-2 btn-sm">
      {buttonName ? buttonName : 'go back'}
    </button>
  )
  return isHref
}
