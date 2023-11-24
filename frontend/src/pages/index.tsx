import Login from '@/components/auth/Login'
import useAuthenticatedUser from '@/hooks/useAuthenticatedUser'
import { Inter } from 'next/font/google'
import Head from 'next/head'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const { user } = useAuthenticatedUser()
  return (
    <>
      <Head>
        <title>Home - PPM System</title>
        <meta name="description" content="home page" />
      </Head>
      {user ? (
        <>
          <h1 className="title">PPM System</h1>
          <div className="grid grid-cols-2 m-2 gap-3">
            <div className="card bg-neutral shadow-2xl">
              <div className="card-body">
                <h2 className="card-title">Parts Statistics</h2>
              </div>
            </div>
            <div className="card bg-neutral shadow-2xl">
              <div className="card-body">
                <h2 className="card-title">PPM`s Statistics</h2>
              </div>
            </div>
          </div>
        </>
      ) : (
        <Login />
      )}
    </>
  )
}
