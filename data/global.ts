import { registerChaiGlobalDataProvider } from '@chaibuilder/pages/server'
import { unstable_cache } from 'next/cache'
import { cache } from 'react'

const globalDataProvider = cache(async (lang: string) => {
  return await unstable_cache(
    async () => {
      return {
        lang,
        name: 'John Doe',
        brand: 'Toyota',
        address: '123 Main St, Anytown, USA',
        phone: '123-456-7890',
        email: 'john.doe@example.com',
        social: {
          facebook: 'https://www.facebook.com/example',
          instagram: 'https://www.instagram.com/example',
          twitter: 'https://www.twitter.com/example',
        },
      }
    },
    ['global-site-data'],
    { tags: ['global-site-data'] }
  )()
})

registerChaiGlobalDataProvider(globalDataProvider)
