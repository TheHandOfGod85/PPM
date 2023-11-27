import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useDebounce } from 'use-debounce'

interface SearchPartsProps {
  id?: string
}

export default function SearchParts({ id }: SearchPartsProps) {
  const [text, setText] = useState('')
  const [query] = useDebounce(text, 700)
  const router = useRouter()
  useEffect(() => {
    if (!query) {
      router.push(`/assets/${id}`)
    } else {
      router.push(`/assets/${id}?search=${query}`)
    }
  }, [query, router, id])
  return (
    <input
      value={text}
      type="text"
      placeholder="⌕ Search"
      className={`input input-bordered min-w-[40%]`}
      onChange={(e) => setText(e.target.value)}
    />
  )
}
