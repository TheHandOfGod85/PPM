'use client'
import { useRouter } from 'next/navigation'
import PaginationBar from '../PaginationBar'

interface AssetsPaginationBarProps {
  currentPage: number
  totalPages: number
}

export default function PartsPaginationBar({
  currentPage,
  totalPages,
}: AssetsPaginationBarProps) {
  const router = useRouter()

  return (
    <PaginationBar
      className="my-4"
      currentPage={currentPage}
      pageCount={totalPages}
      onPageItemClicked={(page) => {
        router.push('/dashboard`/parts?page=' + page)
      }}
    />
  )
}
