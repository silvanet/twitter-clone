import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import NewTweet from 'components/NewTweet'
import Tweets from 'components/Tweets'
import prisma from 'lib/prisma'
import { getTweets } from 'lib/data.js'
import LoadMore from 'components/LoadMore'

export default function Home({ initialTweets}) {
  const [tweets, setTweets] = useState(initialTweets)
  const { data: session, status } = useSession()
  const loading = status === 'loading'
  const router = useRouter()

  if (loading) {
    return null
  }

  if (!session) {
    router.push('/')
  }

  if (session && !session.user.name) {
    router.push('/setup')
  } 

  return (
    <>
      <p className='border px-8 py2 mt-2 font-bold'>Welcome - {session.user.name}</p>
      <NewTweet />
      <Tweets tweets={tweets} />
      <LoadMore tweets={tweets} setTweets={setTweets} />
      <a
          className='border px-8 py-2 mt-5 font-bold rounded-full color-accent-contrast bg-color-accent hover:bg-color-accent-hover-darker'
          href='/api/auth/signout'
        >
          Bye for now
        </a>
    </>
  )
}

export async function getServerSideProps() {
	let tweets = await getTweets(prisma, 2)
  tweets = JSON.parse(JSON.stringify(tweets))

  return {
    props: {
      initialTweets: tweets,
    },
  }
}

// sarah also added this here
// if (session && !session.user.name) {
//   router.push('/setup')
// }