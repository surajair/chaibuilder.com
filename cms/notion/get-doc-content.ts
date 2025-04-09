import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { marked } from "marked";
import { NotionToMarkdown } from "notion-to-md";
import { databaseId, notion } from "./notion";

const n2m = new NotionToMarkdown({ notionClient: notion });

interface DocContent {
  title: string;
  content: string;
  publishedDate: string;
}

export const getDocContent = async (
  slug: string,
  pageType: string
): Promise<DocContent | null> => {
  try {
    // Check if database ID is defined
    if (!databaseId) {
      console.error("Notion database ID is not configured");
      return null;
    }

    // Query the database for a page with the matching slug
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        and: [
          { property: "Page Type", select: { equals: pageType } },
          { property: "Slug", rich_text: { equals: slug } },
          { property: "Status", select: { equals: "Published" } },
        ],
      },
      page_size: 1,
    });

    // Check if any pages were found
    if (response.results.length === 0) {
      console.error(`No document found with slug: ${slug}`);
      return null;
    }

    const doc = response.results[0] as PageObjectResponse;

    if (!doc || !("properties" in doc)) {
      return null;
    }

    const publishedDate =
      (doc.properties["Published Date"] as any)?.date?.start || null;
    const title =
      (doc.properties.Name as any)?.title[0]?.plain_text || "Untitled";

    // Convert Notion blocks to markdown
    const mdBlocks = await n2m.pageToMarkdown(doc.id);
    const markdown = n2m.toMarkdownString(mdBlocks);

    // Convert markdown to HTML
    const content = marked.parse(markdown.parent) as string;

    return {
      title,
      content,
      publishedDate,
    };
  } catch (error) {
    console.error("Error fetching document content:", error);
    return null;
  }
};
