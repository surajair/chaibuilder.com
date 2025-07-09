import { registerBlocks } from "@/blocks";
import { registerServerBlocks } from "@/blocks/index.server";
import {
  chaiBuilderPages,
  getChaiPageData,
  getChaiPageStyles,
  getChaiSiteSettings,
} from "@/chai";
import "@/page-types";
import type { ChaiBlock } from "@chaibuilder/pages";
import { RenderChaiBlocks } from "@chaibuilder/pages/render";
import { ChaiPageProps } from "@chaibuilder/pages/runtime";
import { loadWebBlocks } from "@chaibuilder/pages/web-blocks";
import { first, get } from "lodash";
import { draftMode, headers } from "next/headers";
import { notFound } from "next/navigation";
import PreviewBanner from "@/components/preview-banner";
import { cache } from "react";
import { unstable_cache as nextCache } from "next/cache";
loadWebBlocks();
registerBlocks();
registerServerBlocks();

export const dynamic = "force-static";

export const generateMetadata = async () => {
  return {
    title: "Revision Page",
    description: "Revision Page",
    openGraph: {
      title: "Revision Page",
      description: "Revision Page",
    },
    robots: {
      index: false,
      follow: false,
    },
  };
};

export type PageProps = {
  slug: string;
  pageType: string;
  fallbackLang: string;
  lastSaved: string;
};

export default async function Page({
  params,
}: {
  params: Promise<{ revisions: string[] }>;
}) {
  const { isEnabled } = await draftMode();
  const nextParams = await params;
  const siteSettings: { fallbackLang: string; error?: string } =
    await getChaiSiteSettings();
  const fallbackLang = get(siteSettings, "fallbackLang", "fr");
  chaiBuilderPages.setFallbackLang(fallbackLang);

  // TODO: Change this to use revision data API when it's ready
  // For now, using partial page data as a placeholder
  const id =
    nextParams.revisions.length === 1
      ? first(nextParams.revisions)
      : nextParams.revisions[1];
  const lang =
    nextParams.revisions.length === 2
      ? (first(nextParams.revisions) as string)
      : fallbackLang;

// TODO: Change this to use revision data API when it's ready
const getChaiBuilderPartialPage = cache(
    async (id: string, lang: string) => {
      return nextCache(
        async () => await chaiBuilderPages.getFullPage(id),
        ['page-' + id, lang],
        { tags: ['page-' + id] }
      )()
    }
  )

  const chaiPage = await getChaiBuilderPartialPage(id as string, lang);

  if ("error" in chaiPage && chaiPage.error === "PAGE_NOT_FOUND") {
    return notFound();
  }

  const pageStyles = await getChaiPageStyles(chaiPage.blocks as ChaiBlock[]);
  const pageProps: ChaiPageProps = {
    slug: `/revision/${nextParams.revisions.join("/")}`,
    pageType: chaiPage.pageType,
    fallbackLang,
    lastSaved: chaiPage.lastSaved,
    pageId: chaiPage.id,
    primaryPageId: chaiPage.primaryPage,
    languagePageId: chaiPage.languagePageId,
    pageBaseSlug: chaiPage.slug,
  };

  const pageData = await getChaiPageData({
    blocks: chaiPage.blocks,
    pageType: chaiPage.pageType,
    pageProps,
    lang,
  });

  return (
    <div lang={lang}>
      <style
        id="chaibuilder-styles"
        dangerouslySetInnerHTML={{ __html: pageStyles }}
      />
      {isEnabled && (
        <PreviewBanner
          revision={{
            number: 1,
            publishedBy: "John Doe",
            time: "2023-01-01 12:00:00",
          }}
          slug={`/chai?page=${nextParams.revisions.join("/")}`}
        />
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
  );
}
