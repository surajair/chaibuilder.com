import { getDocSidebarLinks } from "@/cms/notion/get-docs-links";
import { ChaiBlock } from "@chaibuilder/pages/runtime";

export const docsSidebarDataProvider = async (
  block: ChaiBlock<{ title: string }>
) => {
  const docSidebarLinks = await getDocSidebarLinks(block.title);
  return {
    items: docSidebarLinks,
  };
};
