import { cookies } from "next/headers"

export function getCookie() {
    const cookieValue = cookies().get('connect.sid')?.value
    const cookie = `connect.sid=${cookieValue}`
    return cookie
  }