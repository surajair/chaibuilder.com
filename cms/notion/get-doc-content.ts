import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { marked } from "marked";
import { notion } from "./notion";
const { NotionToMarkdown } = require("notion-to-md");

const n2m = new NotionToMarkdown({ notionClient: notion });

interface DocContent {
  id: string;
  title: string;
  content: string;
  html: string;
}

export const getDocContent = async (
  slug: string
): Promise<DocContent | null> => {
  try {
    const doc = (await notion.pages.retrieve({
      page_id: slug,
    })) as PageObjectResponse;

    if (!doc || !("properties" in doc)) {
      return null;
    }

    const title =
      (doc.properties.Name as any)?.title[0]?.plain_text || "Untitled";

    // Convert Notion blocks to markdown
    const mdBlocks = await n2m.pageToMarkdown(slug);
    const markdown = n2m.toMarkdownString(mdBlocks);

    // Convert markdown to HTML
    const html = marked.parse(markdown.parent) as string;

    return {
      id: slug,
      title,
      content: markdown.parent,
      html,
    };
  } catch (error) {
    console.error("Error fetching document content:", error);
    return null;
  }
};
