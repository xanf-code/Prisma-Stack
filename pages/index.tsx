import type { NextPage } from 'next'
import Head from 'next/head'
import AddUser from '../components/addUser'
import DisplayUsers from '../components/displayUsers'

const Home: NextPage = () => {
  return (
    <div className='px-4 py-24 md:py-32 lg:px-0'>
      <Head>
        <title>Todo Prisma Stack</title>
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>

      <main>
        <div className='max-w-screen-sm mx-auto justify-content'>
          <div className='flex items-center'>
            <div className='flex flex-col space-y-4'>
              <h1 className='text-white font-sans text-2xl font-black md:text-4xl'>Prisma Todo App</h1>
              <p className='text-gray-500 font-Quattro text-xl leading-snug md:text-2xl'>Just for fun! Learning Prisma and TypeORMs 👋 ⚡️</p>
              <AddUser />
              <DisplayUsers />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Home
