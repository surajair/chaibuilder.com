import { DocLink } from "@/blocks/docs-sidebar/nav-item";
import { databaseId, notion } from "./notion";

// Simplified type for Notion page from API
type NotionPage = {
  id: string;
  properties: {
    Title?: {
      title: Array<{
        plain_text: string;
      }>;
    };
    Name?: {
      title: Array<{
        plain_text: string;
      }>;
    };
    Slug?: {
      rich_text: Array<{
        plain_text: string;
      }>;
    };
    Status?: {
      status: {
        name: string;
      };
    };
    Parent?: {
      relation: Array<{
        id: string;
      }>;
    };
    "Published Date"?: {
      date: {
        start: string;
      } | null;
    };
    [key: string]: any; // Allow other properties
  };
  // For debugging - this is what we'll check
  object: string;
  url: string;
};

/**
 * Fetch documentation pages from Notion database
 */
async function fetchNotionPages(title: string): Promise<NotionPage[]> {
  if (!databaseId || !process.env.NOTION_API_KEY) {
    console.warn("Notion API key or database ID not configured");
    return [];
  }

  console.log("title", title);

  try {
    // Query the database
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        and: [
          { property: "Page Type", select: { equals: "Documentation" } },
          { property: "Status", select: { equals: "Published" } },
          { property: "Section", select: { equals: title ?? "Overview" } },
        ],
      },
      sorts: [{ property: "Order", direction: "ascending" }],
    });

    return response.results as unknown as NotionPage[];
  } catch (error) {
    console.error("Error fetching Notion database:", error);
    return [];
  }
}

/**
 * Transform Notion pages into a flat array of DocLink structure
 */
function transformNotionToDocLinks(pages: NotionPage[]): DocLink[] {
  const flatLinks: DocLink[] = [];

  pages.forEach((page) => {
    const slug = page.properties.Slug?.rich_text[0]?.plain_text || "";
    const href = slug ? `/docs/${slug}` : "";
    const title = page.properties.Name?.title[0]?.plain_text || "Untitled";

    flatLinks.push({
      title,
      href,
    });
  });

  if (process.env.NODE_ENV === "development") {
    console.log(`Created ${flatLinks.length} doc links`);
  }

  return flatLinks;
}

export const getDocSidebarLinks = async (title: string): Promise<DocLink[]> => {
  try {
    const notionPages = await fetchNotionPages(title);

    if (notionPages.length > 0) {
      return transformNotionToDocLinks(notionPages);
    }

    console.log("No pages returned from Notion, using fallback links");
    return getFallbackLinks();
  } catch (error) {
    console.error("Error getting doc sidebar links:", error);
    return getFallbackLinks();
  }
};

/**
 * Fallback links when Notion API is not available or fails
 */
function getFallbackLinks(): DocLink[] {
  return [];
}
