import Link from 'next/link'
import React from 'react'
interface GoBackButtonProps {
  href: string
}

export default function GoBackButton({ href }: GoBackButtonProps) {
  return (
    <Link href={href}>
      <button className="btn btn-primary mt-2 btn-sm">go back</button>
    </Link>
  )
}
