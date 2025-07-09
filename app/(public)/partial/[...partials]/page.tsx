import { registerBlocks } from '@/blocks'
import { registerServerBlocks } from '@/blocks/index.server'
import {
  chaiBuilderPages,
  getChaiBuilderPartialPage,
  getChaiPageData,
  getChaiPageStyles,
  getChaiSiteSettings,
} from '@/chai'
import '@/page-types'
import type { ChaiBlock } from '@chaibuilder/pages'
import { RenderChaiBlocks } from '@chaibuilder/pages/render'
import { ChaiPageProps } from '@chaibuilder/pages/runtime'
import { loadWebBlocks } from '@chaibuilder/pages/web-blocks'
import { first, get } from 'lodash'
import { draftMode, headers } from 'next/headers'
import { notFound } from 'next/navigation'
import PreviewBanner from '@/components/preview-banner'

loadWebBlocks()
registerBlocks()
registerServerBlocks()

export const dynamic = 'force-static'

interface ChaiPageData extends Record<string, unknown> {
  $contextData?: Record<string, unknown>
  $metadata?: Record<string, string>
}

export const generateMetadata = async () => {
  return {
    title: 'Partial Page',
    description: 'Partial Page',
    openGraph: {
      title: 'Partial Page',
      description: 'Partial Page',
    },
    robots: {
      index: false,
      follow: false,
    },
  }
}

export type PageProps = {
  slug: string
  pageType: string
  fallbackLang: string
  lastSaved: string
}

export default async function Page({
  params,
}: {
  params: Promise<{ partials: string[] }>
}) {
  const { isEnabled } = await draftMode()
  const nextParams = await params
  const siteSettings: { fallbackLang: string; error?: string } =
    await getChaiSiteSettings()
  const fallbackLang = get(siteSettings, 'fallbackLang', 'fr')
  chaiBuilderPages.setFallbackLang(fallbackLang)
  const id =
    nextParams.partials.length === 1
      ? first(nextParams.partials)
      : nextParams.partials[1]
  const lang =
    nextParams.partials.length === 2
      ? (first(nextParams.partials) as string)
      : fallbackLang

  const chaiPage = await getChaiBuilderPartialPage(id as string, lang)

  if ('error' in chaiPage && chaiPage.error === 'PAGE_NOT_FOUND') {
    return notFound()
  }

  const pageStyles = await getChaiPageStyles(chaiPage.blocks as ChaiBlock[])
  const pageProps: ChaiPageProps = {
    slug: `/partial/${nextParams.partials.join('/')}`,
    pageType: chaiPage.pageType,
    fallbackLang,
    lastSaved: chaiPage.lastSaved,
    pageId: chaiPage.id,
    primaryPageId: chaiPage.primaryPage,
    languagePageId: chaiPage.languagePageId,
    pageBaseSlug: chaiPage.slug,
  }

  const pageData: ChaiPageData = await getChaiPageData({
    blocks: chaiPage.blocks,
    pageType: chaiPage.pageType,
    pageProps,
    lang,
  })

  return (
    <div lang={lang}>
      <style
        id='chaibuilder-styles'
        dangerouslySetInnerHTML={{ __html: pageStyles }}
      />
      {isEnabled && (
        <PreviewBanner slug={`/chai?page=${nextParams.partials.join('/')}`} />
      )}
      <RenderChaiBlocks
        externalData={pageData}
        blocks={chaiPage.blocks as unknown as ChaiBlock[]}
        fallbackLang={fallbackLang}
        lang={lang}
        draft={isEnabled}
        pageProps={pageProps}
      />
    </div>
  )
}
