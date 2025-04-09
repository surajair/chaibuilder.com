import { DocLink } from "@/blocks/docs-sidebar/docs-sidebar.client";
import { databaseId, notion } from "./notion";

// Extended DocLink interface with related docs
interface ExtendedDocLink extends DocLink {
  related?: string[];
}

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
async function fetchNotionPages(isDraft: boolean): Promise<NotionPage[]> {
  if (!databaseId || !process.env.NOTION_API_KEY) {
    console.warn("Notion API key or database ID not configured");
    return [];
  }

  try {
    // Query the database
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        and: [
          { property: "Page Type", select: { equals: "Documentation" } },
          ...(isDraft
            ? []
            : [{ property: "Status", select: { equals: "Published" } }]),
        ],
      },
    });

    return response.results as unknown as NotionPage[];
  } catch (error) {
    console.error("Error fetching Notion database:", error);
    return [];
  }
}

/**
 * Transform Notion pages into DocLink structure
 */
function transformNotionToDocLinks(pages: NotionPage[]): DocLink[] {
  const pagesMap = new Map<
    string,
    NotionPage & { docLink: ExtendedDocLink; slug: string }
  >();
  const rootItems: DocLink[] = [];
  const relatedDocsMap = new Map<string, string[]>(); // Map to store related document references

  // First pass: create initial DocLink objects for all pages and store their slugs
  pages.forEach((page) => {
    // Get slug from properties, defaulting to empty string if not available
    const slug = page.properties.Slug?.rich_text[0]?.plain_text || "";
    const href = slug ? `/docs/${slug}` : "";

    // Get title from properties.Name instead of Title
    const title = page.properties.Name?.title[0]?.plain_text || "Untitled";

    pagesMap.set(page.id, {
      ...page,
      slug,
      docLink: {
        title,
        href,
        items: [],
      },
    });
  });

  // Second pass: build hierarchy based on Parent relationship and build paths with parent slugs
  pages.forEach((page) => {
    const pageWithLink = pagesMap.get(page.id);
    if (!pageWithLink) return;

    const parentRelations = page.properties.Parent?.relation || [];

    if (parentRelations.length === 0) {
      // Top-level item - check if it has related docs
      const relatedDocs = relatedDocsMap.get(page.id);

      // Add relatedDocs info as an attribute if present
      if (relatedDocs && relatedDocs.length > 0) {
        pageWithLink.docLink.related = relatedDocs;
      }

      rootItems.push(pageWithLink.docLink);
    } else {
      // Child item - add to parent's items
      const parentId = parentRelations[0].id;
      const parent = pagesMap.get(parentId);

      if (parent) {
        // Update the child's href to include parent slug if both exist
        if (parent.slug && pageWithLink.slug) {
          pageWithLink.docLink.href = `/docs/${pageWithLink.slug}`;
        }

        // Add relatedDocs info as an attribute if present
        const relatedDocs = relatedDocsMap.get(page.id);
        if (relatedDocs && relatedDocs.length > 0) {
          pageWithLink.docLink.related = relatedDocs;
        }

        if (!parent.docLink.items) {
          parent.docLink.items = [];
        }
        parent.docLink.items.push(pageWithLink.docLink);
      } else {
        // Parent not found, add to root
        rootItems.push(pageWithLink.docLink);
      }
    }
  });

  // Filter based on status
  const publishedItems = rootItems.filter((item) => {
    // We already filtered by "Published" in the database query,
    // so we don't need additional filtering here
    return true;
  });

  if (process.env.NODE_ENV === "development") {
    console.log(`Created ${publishedItems.length} root level doc sections`);
  }

  return publishedItems;
}

export const getDocSidebarLinks = async (
  isDraft: boolean
): Promise<DocLink[]> => {
  try {
    // Try to fetch from Notion
    const notionPages = await fetchNotionPages(isDraft);

    if (notionPages.length > 0) {
      const docLinks = transformNotionToDocLinks(notionPages);
      return docLinks;
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
