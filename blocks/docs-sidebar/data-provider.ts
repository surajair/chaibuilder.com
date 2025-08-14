import { getDocSidebarLinks } from "@/cms/github/get-docs-links";
import { ChaiBlock } from "chai-next/blocks";

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
