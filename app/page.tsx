import type { Homepage } from '@/app/payload-types'
import { languageTag } from '@/paraglide/runtime'
import TwoColumnBlockComponent from '@/components/TwoColumnBlock'
import type { TwoColumnBlock } from '@/app/payload-types'

async function getData(locale: string) {
  let data: Homepage[] = []
  try {
    const res = await fetch(`${process.env.PAYLOAD_URL}/api/homepage?locale=${locale}&depth=1`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `users API-Key ${process.env.PAYLOAD_API_KEY}`,
      },
    })
    if (!res.ok) {
      console.error('Failed to fetch:', res.status, res.statusText)
      throw new Error(`HTTP error status: ${res.status}`)
    }
    const dataRes = await res.json()
    data = dataRes.docs
  } catch (error) {
    console.error('Error fetching data:', error)
  }
  return data
}

export async function generateMetadata() {
  const locale = languageTag()
  const pages: Homepage[] = await getData(locale)
  const page = pages[0]
  return {
    title: page?.meta?.title,
    description: page?.meta?.description,
    openGraph: {
      title: page?.meta?.title,
    },
  }
}

export default async function Home() {
  const locale = languageTag()
  const pages: Homepage[] = await getData(locale)
  const page = pages[0]

  return (
    <article className="">
      <div key={page.id} className="flex flex-col gap-4">
        <h2 className="text-2xl">{page.title}</h2>
      </div>
      <TwoColumnBlockComponent block={page.layout as TwoColumnBlock[]} />
      {/* <p>
        {'Visit the '}
        <Link href="/login">login page</Link>
        {' to start the authentication flow. Once logged in, you will be redirected to the '}
        <Link href="/account">account page</Link>
        {` which is restricted to users only. To manage all users, `}
        <Link href={`${process.env.NEXT_PUBLIC_PAYLOAD_URL}/admin/collections/users`}>
          login to the admin dashboard
        </Link>
        {'.'}
      </p> */}
    </article>
  )
}
