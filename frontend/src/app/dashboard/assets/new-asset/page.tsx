import NewAssetForm from '@/app/ui/assets/NewAssetForm'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'New asset',
  description: 'New asset page',
}

export default async function NewAssetPage() {
  return <NewAssetForm />
}
