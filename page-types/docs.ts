import { getDocContent } from "@/cms/notion/get-doc-content";
import { registerChaiPageType } from "@chaibuilder/pages/server";

registerChaiPageType("docs", {
  name: "Documentation",
  helpText: "A documentation page.",
  dynamicSegments: "/[a-z0-9]+(?:-[a-z0-9]+)*(?:/[a-z0-9]+(?:-[a-z0-9]+)*)*$", // regex for slug. starts with / and should contain one or more segments with lowercase letters, numbers and hyphens
  dynamicSlug: "{{slug}}",
  dataProvider: async (props, _lang, _draft, inBuilder) => {
    const slug = props.slug;
    console.log("slug #3", slug);
    const document = await getDocContent(
      inBuilder ? "about-chai-builder" : slug.replace("/docs/", ""),
      "Documentation"
    );
    return {
      page: {
        title: document?.title,
        content: document?.content,
      },
    };
  },
});
