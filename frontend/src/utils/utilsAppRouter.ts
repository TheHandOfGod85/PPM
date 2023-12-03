'use server'
import { cookies } from 'next/headers'

export async function getCookie() {
  const cookieValue = cookies().get('connect.sid')?.value
  const cookie = `connect.sid=${cookieValue}`
  return cookie
}
