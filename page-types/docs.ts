import { getDocContent } from "@/cms/github/get-doc-content";
import { registerChaiPageType } from "@chaibuilder/pages/server";

registerChaiPageType("docs", {
  name: "Documentation",
  helpText: "A documentation page.",
  dynamicSegments: "/[a-z0-9]+(?:-[a-z0-9]+)*(?:/[a-z0-9]+(?:-[a-z0-9]+)*)*$", // regex for slug. starts with / and should contain one or more segments with lowercase letters, numbers and hyphens
  dynamicSlug: "{{slug}}",
  dataProvider: async ({ pageProps, inBuilder }) => {
    const slug = pageProps.slug;
    const document = await getDocContent(
      inBuilder ? "docs/overview/about-chai-builder" : slug,
      "Documentation"
    );
    return { page: document };
  },
});
