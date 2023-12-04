import NextAuth, { DefaultSession } from 'next-auth'
import { JWT } from 'next-auth/jwt'

declare module 'next-auth' {
  interface Session {
    user: {
      _id: string
      username: string
      email: string
      displayName: string
      about: string
      role: string
      verified: boolean
      cookie: string
      createdAt: string
      updatedAt: string
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    user: {
      role: string
      displayName: string
    }
  }
}
