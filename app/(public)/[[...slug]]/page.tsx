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
import { ChaiBlock } from "@chaibuilder/pages/builder";
import { RenderChaiBlocks } from "@chaibuilder/pages/render";
import { ChaiPageProps } from "@chaibuilder/pages/runtime";
import { loadWebBlocks } from "@chaibuilder/pages/web-blocks";
import { get } from "lodash";
import isEmpty from "lodash/isEmpty";
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
  chaiBuilderPages.setLanguageFromSlug(nextParams.slug);
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
  chaiBuilderPages.setFallbackLang(get(siteSettings, "fallbackLang", ""));
  chaiBuilderPages.setLanguageFromSlug(nextParams.slug);

  const chaiPage = await getChaiBuilderPage(slug);

  if ("error" in chaiPage && chaiPage.error === "PAGE_NOT_FOUND") {
    return notFound();
  }

  const pageProps: ChaiPageProps = {
    slug,
    pageType: chaiPage.pageType,
    fallbackLang: chaiBuilderPages.getFallbackLang(),
  };

  const pageStyles = await getChaiPageStyles(chaiPage.blocks as ChaiBlock[]);
  const fallbackLang = chaiBuilderPages.getFallbackLang();

  const pageData = await getChaiPageData(chaiPage.pageType, pageProps);

  return (
    <>
      <style
        id="chaibuilder-styles"
        dangerouslySetInnerHTML={{ __html: pageStyles }}
      />
      {isEnabled && <PreviewBanner slug={slug} />}
      <RenderChaiBlocks
        externalData={pageData}
        blocks={chaiPage.blocks as unknown as ChaiBlock[]}
        fallbackLang={fallbackLang}
        lang={isEmpty(chaiPage.lang) ? fallbackLang : chaiPage.lang}
        pageProps={pageProps}
        dataProviderMetadataCallback={(args) => {
          console.log(args);
        }}
      />
    </>
  );
}
