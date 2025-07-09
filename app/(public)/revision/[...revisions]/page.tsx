// import { registerBlocks } from "@/blocks";
// import { registerServerBlocks } from "@/blocks/index.server";
// import {
//   chaiBuilderPages,
//   getChaiPageData,
//   getChaiPageStyles,
//   getChaiSiteSettings,
// } from "@/chai";
// import "@/page-types";
// import type { ChaiBlock } from "@chaibuilder/pages";
// import { RenderChaiBlocks } from "@chaibuilder/pages/render";
// import { ChaiPageProps } from "@chaibuilder/pages/runtime";
// import { loadWebBlocks } from "@chaibuilder/pages/web-blocks";
// import { first, get } from "lodash";
// import { draftMode, headers } from "next/headers";
// import { notFound } from "next/navigation";
// import PreviewBanner from "@/components/preview-banner";
// import { cache } from "react";
// import { unstable_cache as nextCache } from "next/cache";
// loadWebBlocks();
// registerBlocks();
// registerServerBlocks();

// export const dynamic = "force-static";

// export const generateMetadata = async () => {
//   return {
//     title: "Revision Page",
//     description: "Revision Page",
//     openGraph: {
//       title: "Revision Page",
//       description: "Revision Page",
//     },
//     robots: {
//       index: false,
//       follow: false,
//     },
//   };
// };

// export type PageProps = {
//   slug: string;
//   pageType: string;
//   fallbackLang: string;
//   lastSaved: string;
// };

// export default async function Page({
//   params,
//   searchParams,
// }: {
//   params: Promise<{ revisions: string[] }>;
//   searchParams: { label?: string };
// }) {
//   const { isEnabled } = await draftMode();
//   const nextParams = await params;
//   const siteSettings: { fallbackLang: string; error?: string } =
//     await getChaiSiteSettings();
//   const fallbackLang = get(siteSettings, "fallbackLang", "fr");
//   chaiBuilderPages.setFallbackLang(fallbackLang);

//   // Extract revisionId from the URL parameters
//   const revisionId = first(nextParams.revisions);
//   const label = searchParams.label || "1"; // Default to label 1 if not provided
  
//   // Use fallback language if not specified
//   const lang = fallbackLang;

// // TODO: Change this to use revision data API when it's ready
// const getChaiBuilderPartialPage = cache(
//     async (id: string, lang: string) => {
//       return nextCache(
//         async () => await chaiBuilderPages.getFullPage(id),
//         ['page-' + id, lang],
//         { tags: ['page-' + id] }
//       )()
//     }
//   )

//   const chaiPage = await getChaiBuilderPartialPage(revisionId as string, lang);

//   if ("error" in chaiPage && chaiPage.error === "PAGE_NOT_FOUND") {
//     return notFound();
//   }

//   const pageStyles = await getChaiPageStyles(chaiPage.blocks as ChaiBlock[]);
//   const pageProps: ChaiPageProps = {
//     slug: `/revision/${revisionId}`,
//     pageType: chaiPage.pageType,
//     fallbackLang,
//     lastSaved: chaiPage.lastSaved,
//     pageId: chaiPage.id,
//     primaryPageId: chaiPage.primaryPage,
//     languagePageId: chaiPage.languagePageId,
//     pageBaseSlug: chaiPage.slug,
//   };

//   const pageData = await getChaiPageData({
//     blocks: chaiPage.blocks,
//     pageType: chaiPage.pageType,
//     pageProps,
//     lang,
//   });

//   return (
//     <div lang={lang}>
//       <style
//         id="chaibuilder-styles"
//         dangerouslySetInnerHTML={{ __html: pageStyles }}
//       />
//       {/* Add revision label indicator */}
//       <div className="fixed top-0 right-0 bg-gray-800 text-white px-3 py-1 text-sm z-50">
//         {label === "live" ? "Live Version" : label === "draft" ? "Draft Version" : `Revision ${label}`}
//       </div>
//       {isEnabled && (
//         <PreviewBanner
//           revision={{
//             number: parseInt(label) || 1,
//             publishedBy: "John Doe",
//             time: "2023-01-01 12:00:00",
//           }}
//           slug={`/chai?page=${revisionId}`}
//         />
//       )}
//       <RenderChaiBlocks
//         externalData={pageData}
//         blocks={chaiPage.blocks as unknown as ChaiBlock[]}
//         fallbackLang={fallbackLang}
//         lang={lang}
//         draft={isEnabled}
//         pageProps={pageProps}
//       />
//     </div>
//   );
// }

// Basic component that logs the ID
const LogIdComponent = ({ id }: { id: string }) => {
  console.log(`Component ID: ${id}`);


  return (
    <div>
      <h1>Component ID: {id}</h1>
    </div>
  );
};

export default async function Page({
  params,
}: {
  params: Promise<{ revisions: string[] }>;
}) {
  const { revisions } = await params;
  return <LogIdComponent id={revisions.join(",")} />;
}
    