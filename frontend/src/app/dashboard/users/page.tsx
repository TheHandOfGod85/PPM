import UsersTable from '@/app/ui/users/UsersTable'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Users',
  description: 'Users page',
}

export default async function UsersPage() {
  return <UsersTable />
}
