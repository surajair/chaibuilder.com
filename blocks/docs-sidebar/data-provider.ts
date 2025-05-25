import { getDocSidebarLinks } from "@/cms/github/get-docs-links";
import { ChaiBlock } from "@chaibuilder/pages/runtime";

export const docsSidebarDataProvider = async ({
  block,
}: {
  block: ChaiBlock;
}) => {
  const docSidebarLinks = await getDocSidebarLinks(block.title);
  return {
    items: docSidebarLinks,
  };
};
