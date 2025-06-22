import { registerBlocks } from "@/blocks";
import { registerServerBlocks } from "@/blocks/index.server";
import {
  chaiBuilderPages,
  getChaiBuilderPage,
  getChaiPageData,
  getChaiPageSeoMetadata,
  getChaiPageStyles,
  getChaiSiteSettings,
  NextPageProps,
} from "@/chai";
import PreviewBanner from "@/components/preview-banner";
import "@/page-types";
import { RenderChaiBlocks } from "@chaibuilder/pages/render";
import { ChaiPageProps } from "@chaibuilder/pages/runtime";
import { loadWebBlocks } from "@chaibuilder/pages/web-blocks";
import { get } from "lodash";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";

loadWebBlocks();
registerBlocks();
registerServerBlocks();

export const dynamic = "force-static"; // Remove this if you want to use ssr mode

export const generateMetadata = async (props: NextPageProps) => {
  const nextParams = await props.params;
  const slug = nextParams.slug ? `/${nextParams.slug.join("/")}` : "/";

  const siteSettings = await getChaiSiteSettings();
  chaiBuilderPages.setFallbackLang(get(siteSettings, "fallbackLang", ""));

  const chaiPage = await getChaiBuilderPage(slug);
  const pageProps: ChaiPageProps = {
    slug,
    pageType: chaiPage.pageType,
    fallbackLang: chaiBuilderPages.getFallbackLang(),
  };
  return await getChaiPageSeoMetadata(pageProps);
};

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { isEnabled } = await draftMode();
  const nextParams = await params;
  const slug = nextParams.slug ? `/${nextParams.slug.join("/")}` : "/";

  const siteSettings = await getChaiSiteSettings();
  chaiBuilderPages.setFallbackLang(get(siteSettings, "fallbackLang", "en"));

  const chaiPage = await getChaiBuilderPage(slug);
  const fallbackLang = chaiBuilderPages.getFallbackLang();

  if ("error" in chaiPage && chaiPage.error === "PAGE_NOT_FOUND") {
    return notFound();
  }

  const pageLang = chaiPage.lang || fallbackLang;
  const pageProps: ChaiPageProps = {
    slug,
    pageType: chaiPage.pageType,
    fallbackLang,
  };

  const pageStyles = await getChaiPageStyles(chaiPage.blocks);

  const pageData = await getChaiPageData({
    blocks: chaiPage.blocks,
    pageType: chaiPage.pageType,
    pageProps,
    lang: pageLang,
  });

  return (
    <>
      <style
        id="chaibuilder-styles"
        dangerouslySetInnerHTML={{ __html: pageStyles }}
      />
      {isEnabled && <PreviewBanner slug={slug} />}
      <RenderChaiBlocks
        externalData={pageData}
        blocks={chaiPage.blocks}
        fallbackLang={fallbackLang}
        lang={pageLang}
        pageProps={pageProps}
      />
    </>
  );
}
