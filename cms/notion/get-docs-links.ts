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
 * Transform Notion pages into a nested DocLink structure based on parent-child relationships
 */
function transformNotionToDocLinks(pages: NotionPage[]): DocLink[] {
  // Create a map of all pages by ID for easy lookup
  const pagesById = new Map<string, NotionPage>();
  pages.forEach((page) => {
    pagesById.set(page.id, page);
  });

  // Define an extended DocLink type with temporary ID for internal use
  interface DocLinkWithId extends DocLink {
    id: string;
  }

  // First pass: Create basic DocLink objects for each page
  const allLinks = pages.map((page) => {
    const slug = page.properties.Slug?.rich_text[0]?.plain_text || "";
    const href = slug ? `/docs/${slug}` : "";
    const title = page.properties.Name?.title[0]?.plain_text || "Untitled";

    return {
      id: page.id,
      title,
      href,
      items: [] as DocLink[],
    } as DocLinkWithId;
  });

  // Create a lookup map for these links
  const linksById = new Map<string, DocLinkWithId>();
  allLinks.forEach((link) => {
    linksById.set(link.id, link);
  });

  // Second pass: Build the parent-child relationships
  const rootLinks: DocLinkWithId[] = [];

  pages.forEach((page) => {
    const link = linksById.get(page.id);
    if (!link) return;

    // Check if this page has a parent
    const parentRelations = page.properties.Parent?.relation || [];

    if (parentRelations.length > 0) {
      // This is a child page, find the parent link and add this as a child
      const parentId = parentRelations[0].id;
      const parentLink = linksById.get(parentId);

      if (parentLink) {
        // Add to parent's items array
        parentLink.items = parentLink.items || [];
        parentLink.items.push({
          title: link.title,
          href: link.href,
          items: link.items,
        });
      } else {
        // If parent not found in our current section, add to root
        rootLinks.push(link);
      }
    } else {
      // This is a root level page
      rootLinks.push(link);
    }
  });

  // Clean up the return type to match DocLink (remove the temporary id property)
  const result: DocLink[] = rootLinks.map(({ id, ...rest }) => rest);

  if (process.env.NODE_ENV === "development") {
    console.log(
      `Created ${allLinks.length} doc links with ${rootLinks.length} root items`
    );
  }

  return result;
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
