import { getDocContent } from "@/cms/github/get-doc-content";
import { registerChaiPageType } from "@chaibuilder/pages/server";

registerChaiPageType("legal", {
  name: "Legal",
  helpText: "A legal page.",
  dynamicSegments: "/[a-z0-9]+(?:-[a-z0-9]+)*(?:/[a-z0-9]+(?:-[a-z0-9]+)*)*$", // regex for slug. starts with / and should contain one or more segments with lowercase letters, numbers and hyphens
  dynamicSlug: "{{slug}}",
  dataProvider: async ({ pageProps, inBuilder }) => {
    const slug = pageProps.pageType + pageProps.slug;
    const document = await getDocContent(slug, "Legal");
    return {
      page: {
        lastUpdated: document?.publishedDate
          ? new Date(document.publishedDate).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          : null,
        title: document?.title,
        content: document?.content,
      },
    };
  },
});
