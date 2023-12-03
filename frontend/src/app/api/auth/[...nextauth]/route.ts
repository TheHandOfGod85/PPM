import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import api from '@/app/lib/axiosInstance'
import { getCookie } from '@/utils/utilsAppRouter'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',

      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        // Add logic here to look up the user from the credentials supplied
        if (!credentials?.username || !credentials?.password) return null
        const { username, password } = credentials
        const res = await api.post('/user/login', {
          username,
          password,
        })
        if (res.status == 401) {
          console.log(res.statusText)

          return null
        }
        const user = res.data

        if (user) {
          return user
        } else {
          return null
        }
      },
    }),
  ],
  pages: {
    signIn: '/',
  },
  callbacks: {
    async jwt({ token, user }) {
      const cookie = await getCookie()
      return {
        ...token,
        ...user,
        cookie,
      }
    },
    async session({ session, token, user }) {
      session.user = token as any
      return session
    },
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
