import NewAssetForm from '@/ui/assets/NewAssetForm'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'New asset',
  description: 'New asset page',
}

export default function NewAssetPage() {
  return <NewAssetForm />
}
