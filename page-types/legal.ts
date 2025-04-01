import { getDocContent } from "@/cms/notion/get-doc-content";
import { registerChaiPageType } from "@chaibuilder/pages/server";

registerChaiPageType("legal", {
  name: "Legal",
  helpText: "A legal page.",
  dynamicSegments: "/[a-z0-9]+(?:-[a-z0-9]+)*(?:/[a-z0-9]+(?:-[a-z0-9]+)*)*$", // regex for slug. starts with / and should contain one or more segments with lowercase letters, numbers and hyphens
  dynamicSlug: "{{slug}}",
  dataProvider: async (props, _lang, _isDraft, inBuilder) => {
    const slug = props.slug;
    const document = await getDocContent(
      inBuilder ? "privacy-policy" : slug,
      "Legal"
    );
    return {
      page: {
        lastUpdated: document?.publishedDate,
        title: document?.title,
        content: document?.content,
      },
    };
  },
});
