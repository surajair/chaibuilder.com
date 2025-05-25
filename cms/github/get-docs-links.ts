import { DocLink } from "@/blocks/docs-sidebar/nav-item";

// Helper function to strip numeric prefixes from titles
function stripNumericPrefix(title: string): string {
  return title.replace(/^\d+-/, "");
}

// Helper function to extract numeric prefix for sorting
function getNumericPrefix(key: string): number {
  const match = key.match(/^(\d+)-/);
  return match ? parseInt(match[1], 10) : 999; // Default to a high number if no prefix
}

export const getDocSidebarLinks = async (title: string): Promise<DocLink[]> => {
  try {
    // Get GitHub token from environment variable
    const githubToken = process.env.GITHUB_TOKEN;

    const headers: HeadersInit = {};
    if (githubToken) {
      headers["Authorization"] = `token ${githubToken}`;
    }

    // Fetch the docs.json file from GitHub
    const res: Response = await fetch(
      `https://raw.githubusercontent.com/chaibuilder/docs/main/docs.json`,
      { headers, cache: "force-cache" }
    );

    if (!res.ok) {
      throw new Error(`GitHub API error! Status: ${res.status}`);
    }

    const docsData: any[] = await res.json();

    if (!Array.isArray(docsData)) {
      console.error("Invalid docs.json structure:", docsData);
      return getFallbackLinks(title);
    }

    // Find the section that matches the title
    // The title might be something like 'overview' or 'developers'
    const titleLower = title.toLowerCase();
    const section = docsData.find(
      (item) =>
        item.title.toLowerCase() === titleLower ||
        item.id.replace(/^\d+-/, "").toLowerCase() === titleLower
    );

    if (!section) {
      console.error(`Section not found for title: ${title}`);
      return getFallbackLinks(title);
    }

    // Transform the docs.json structure to match DocLink type
    const transformDocsToDocLinks = (items: any[]): DocLink[] => {
      return items.map((item) => {
        // If it has a path, it's a leaf node (document)
        if (item.path) {
          return {
            title: item.title,
            href: item.slug,
            originalKey: item.id, // Keep original id for reference if needed
          };
        }

        // If it has children, it's a parent node (section)
        if (item.children && Array.isArray(item.children)) {
          return {
            title: item.title,
            items: transformDocsToDocLinks(item.children),
            originalKey: item.id, // Keep original id for reference if needed
          };
        }

        // Fallback case (shouldn't happen with well-formed docs.json)
        return {
          title: item.title || "Unknown",
          href: item.slug || "#",
          originalKey: item.id,
        };
      });
    };

    // If the section has children, transform them
    if (section.children && Array.isArray(section.children)) {
      return transformDocsToDocLinks(section.children);
    }

    // If no children found, return fallback links
    return getFallbackLinks(title);
  } catch (error) {
    console.error("Error getting doc sidebar links:", error);
    return getFallbackLinks(title);
  }
};

function getFallbackLinks(title: string): DocLink[] {
  // Return some fallback links in the correct DocLink format
  return [];
}
