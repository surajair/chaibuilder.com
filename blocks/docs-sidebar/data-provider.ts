import { getDocSidebarLinks } from "@/cms/notion/get-docs-links";

export const docsSidebarDataProvider = async () => {
  const docSidebarLinks = await getDocSidebarLinks();
  return {
    links: docSidebarLinks,
  };
};
