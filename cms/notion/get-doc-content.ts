import { notion } from "./notion";

export const getDocContent = async (slug: string) => {
  const doc = await notion.pages.retrieve({ page_id: slug });
  return doc;
};
