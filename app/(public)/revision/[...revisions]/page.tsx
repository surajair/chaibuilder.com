import { registerBlocks } from "@/blocks";
import { registerServerBlocks } from "@/blocks/index.server";
import {
  chaiBuilderPages,
  getChaiBuilderRevisionPage,
  getChaiPageStyles,
  getChaiSiteSettings,
} from "@/chai";
import PreviewBanner from "@/components/preview-banner";
import "@/page-types";
import type { ChaiBlock } from "@chaibuilder/pages";
import { RenderChaiBlocks } from "@chaibuilder/pages/render";
import { ChaiPageProps } from "@chaibuilder/pages/runtime";
import { loadWebBlocks } from "@chaibuilder/pages/web-blocks";
import { first, get } from "lodash";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";

loadWebBlocks();
registerBlocks();
registerServerBlocks();

export const dynamic = "force-dynamic";

export const generateMetadata = async () => {
  return {
    title: "View Revision",
    description: "View Revision",
    openGraph: {
      title: "View Revision",
      description: "View Revision",
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
  searchParams,
}: {
  params: Promise<{ revisions: string[] }>;
  searchParams: Promise<{
    label?: string;
    lang?: string;
  }>;
}) {
  const { isEnabled } = await draftMode();
  const nextParams = await params;
  const search = await searchParams;

  const siteSettings: { fallbackLang: string; error?: string } =
    await getChaiSiteSettings();
  const fallbackLang = get(siteSettings, "fallbackLang", "en");
  chaiBuilderPages.setFallbackLang(fallbackLang);

  const pathSegment = decodeURIComponent(nextParams.revisions[0]);

  let type: "draft" | "live" | "revision" = "revision";
  let id = "";
  let lang = fallbackLang;
  let label = "";
  const typeMatch = pathSegment.match(/^(revision|draft|live):([^:]+)/);
  if (typeMatch) {
    type = typeMatch[1] as "draft" | "live" | "revision";
    id = typeMatch[2];
  } else {
    id = pathSegment;
  }
  if (search.lang) {
    lang = search.lang;
  }
  if (search.label) {
    label = search.label;
  }
  const chaiPage = await getChaiBuilderRevisionPage({
    id,
    type,
    lang,
  });

  if ("error" in chaiPage && chaiPage.error === "NOT_FOUND") {
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

  return (
    <div lang={lang}>
      <style
        id="chaibuilder-styles"
        dangerouslySetInnerHTML={{ __html: pageStyles }}
      />
      {isEnabled && (
        <PreviewBanner
          revision={{
            label: label,
            publishedBy: chaiPage.publishedBy || "",
            time: chaiPage.lastSaved,
            type: type,
          }}
          slug={`/revision/${nextParams.revisions.join("/")}`}
        />
      )}
      <RenderChaiBlocks
        externalData={chaiPage}
        blocks={chaiPage.blocks as unknown as ChaiBlock[]}
        fallbackLang={fallbackLang}
        lang={lang}
        draft={isEnabled}
        pageProps={pageProps}
      />
    </div>
  );
}
