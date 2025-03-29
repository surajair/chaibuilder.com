//TODO: Create a separate @chaibuilder/nextjs package for this file
import { filterDuplicateStyles } from "@/utils/styles-helper";
import { getStylesForBlocks } from "@chaibuilder/pages/render";
import {
  ChaiBuilderPages,
  ChaiBuilderPagesBackend,
} from "@chaibuilder/pages/server";
import { ChaiBlock } from "@chaibuilder/sdk";
import { each, isEmpty } from "lodash";
import { unstable_cache as nextCache } from "next/cache";
import { cache } from "react";

const APP_API_KEY = process.env.CHAIBUILDER_API_KEY;

export type NextPageProps = {
  params: Promise<{ slug: string[] }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

const chaiBuilderPages = new ChaiBuilderPages(
  new ChaiBuilderPagesBackend(APP_API_KEY!)
);

export const getChaiBuilderPage = cache(async (slug: string) => {
  const response = await chaiBuilderPages.getPageBySlug(slug);

  if ("error" in response) {
    return response;
  }

  const tagPageId = response.id;
  return nextCache(
    async () => {
      const responseData = await chaiBuilderPages.getFullPage(response.id);
      return responseData;
    },
    ["page-" + response.lang, response.id],
    { tags: ["page-" + tagPageId] }
  )();
});

export const getChaiSiteSettings = cache(async () => {
  return nextCache(
    async () => await chaiBuilderPages.getSiteSettings(),
    ["site-settings"],
    { tags: ["site-settings"] }
  )();
});

export const getChaiPageData = cache(
  async (pageType: string, props: { params: { slug: string[] } }) => {
    const pageData = await chaiBuilderPages.getPageData(pageType, props);
    return pageData;
  }
);

export const getChaiPageSeoMetadata = cache(
  async ({ params }: { params: { slug: string[] } }) => {
    const slug = params.slug ? `/${params.slug.join("/")}` : "/";
    const pageData = await getChaiBuilderPage(slug);
    let seoData = pageData?.seo ?? {};
    // check if the seo json has any dynamic values. stringify and check if it has any dynamic values.
    let seoJson = JSON.stringify(seoData);
    const hasDynamicValues = seoJson.match(/\{\{.*?\}\}/g);
    if (hasDynamicValues) {
      const pageSeoFields = await getChaiPageData(pageData.pageType, {
        params,
      });

      if (!isEmpty(pageSeoFields)) {
        // Recursively get all possible paths from the pageSeoFields object
        const replaceNestedValues = (
          obj: Record<string, unknown>,
          prefix = ""
        ): { [key: string]: string } => {
          let paths: { [key: string]: string } = {};

          for (const key in obj) {
            const value = obj[key];
            const newPrefix = prefix ? `${prefix}.${key}` : key;

            if (
              typeof value === "object" &&
              value !== null &&
              !Array.isArray(value)
            ) {
              paths = {
                ...paths,
                ...replaceNestedValues(
                  value as Record<string, unknown>,
                  newPrefix
                ),
              };
            } else if (!Array.isArray(value)) {
              paths[newPrefix] = String(value);
            }
          }

          return paths;
        };

        const flattenedFields = replaceNestedValues(pageSeoFields);

        // Replace all dynamic values with their corresponding values
        each(flattenedFields, (value, path) => {
          seoJson = seoJson.replace(`{{${path}}}`, value);
        });
      }

      try {
        seoData = JSON.parse(seoJson);
      } catch (error) {
        console.error("Error parsing SEO JSON:", error);
      }
      return seoData;
    }

    return {
      title: seoData?.title,
      description: seoData?.description,
      openGraph: {
        title: seoData?.ogTitle,
        description: seoData?.ogDescription,
        images: seoData?.ogImage ? [seoData?.ogImage] : [],
      },
    };
  }
);

export const getChaiPageStyles = async (blocks: ChaiBlock[]) => {
  const styles = await getStylesForBlocks(blocks);
  // minify styles and filter out duplicates
  const minifiedStyles = styles.replace(/\s+/g, " ").trim();
  const filteredStyles = await filterDuplicateStyles(minifiedStyles);
  return filteredStyles;
};

export { chaiBuilderPages };
