'use client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useDebounce } from 'use-debounce'

export default function SearchAssets() {
  const [text, setText] = useState('')
  const [query] = useDebounce(text, 700)
  const router = useRouter()
  useEffect(() => {
    if (!query) {
      router.push('/assets')
    } else {
      router.push(`/assets?search=${query}`)
    }
  }, [query, router])
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
