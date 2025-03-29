import { registerBlocks } from "@/blocks";
import { registerServerBlocks } from "@/blocks/index.server";
import {
  chaiBuilderPages,
  getChaiBuilderPage,
  getChaiPageData,
  getChaiPageSeoMetadata,
  getChaiPageStyles,
  NextPageProps,
} from "@/chai";
import "@/page-types";
import { ChaiBlock } from "@chaibuilder/pages/builder";
import { RenderChaiBlocks } from "@chaibuilder/pages/render";
import { loadWebBlocks } from "@chaibuilder/pages/web-blocks";
import isEmpty from "lodash/isEmpty";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import PreviewBanner from "../PreviewBanner";

loadWebBlocks();
registerBlocks();
registerServerBlocks();

export const dynamic = "force-static"; // Remove this if you want to use ssr mode

export const generateMetadata = async (props: NextPageProps) => {
  return await getChaiPageSeoMetadata({ params: await props.params });
};

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { isEnabled } = await draftMode();
  const nextParams = await params;
  const slug = nextParams.slug ? `/${nextParams.slug.join("/")}` : "/";
  chaiBuilderPages.setLanguageFromSlug(nextParams.slug);

  const chaiPage = await getChaiBuilderPage(slug);

  if ("error" in chaiPage && chaiPage.error === "PAGE_NOT_FOUND") {
    return notFound();
  }

  const pageStyles = await getChaiPageStyles(chaiPage.blocks as ChaiBlock[]);
  const fallbackLang = chaiBuilderPages.getFallbackLang();

  const pageData = await getChaiPageData(chaiPage.pageType, {
    params: nextParams,
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
        blocks={chaiPage.blocks as unknown as ChaiBlock[]}
        fallbackLang={fallbackLang}
        {...(!isEmpty(chaiPage.lang) && { lang: chaiPage.lang })}
        metadata={{
          params: nextParams,
          pageType: chaiPage.pageType,
          fallbackLang,
        }}
      />
    </>
  );
}
