'use client'
import { useRouter } from 'next/router'
import GoBackButton from './ui/GoBackButton'

export default function ErrorPage() {
  const router = useRouter()
  return (
    <div className="flex flex-col items-center justify-center h-[40rem]">
      <h1 className="title ">Error &#128534;</h1>
      <p className="text-accent-focus mb-3">
        Looks like something went wrong, please refresh the page or contact
        support.
      </p>
      <GoBackButton
        onClick={() => {
          router.reload()
        }}
        buttonName="refresh"
      />
    </div>
  )
}
