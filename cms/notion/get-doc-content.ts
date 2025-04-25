import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { marked } from "marked";
import { NotionToMarkdown } from "notion-to-md";
import { codeToHtml } from "shiki";
import { databaseId, notion } from "./notion";

// Create the base NotionToMarkdown instance
const n2m = new NotionToMarkdown({ notionClient: notion });

interface DocContent {
  title: string;
  content: string;
  publishedDate: string;
}

/**
 * Add syntax highlighting to HTML code blocks
 */
async function addSyntaxHighlighting(html: string): Promise<string> {
  // Find code blocks in HTML
  const codeBlockRegex =
    /<pre><code class="language-(\w+)">([\s\S]*?)<\/code><\/pre>/g;

  let match;
  let result = html;

  // Process each code block
  while ((match = codeBlockRegex.exec(html)) !== null) {
    const [fullMatch, language, code] = match;
    try {
      // Decode HTML entities in the code
      const decodedCode = code
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&amp;/g, "&")
        .replace(/&quot;/g, '"')
        .replace(/&apos;/g, "'")
        .replace(/&#39;/g, "'")
        // Preserve newlines and indentation
        .replace(/&nbsp;/g, " ")
        .replace(/\n/g, "\n");

      // Apply syntax highlighting
      const highlightedCode = await codeToHtml(decodedCode, {
        lang: language || "text",
        theme: "github-dark",
        transformers: [
          {
            code(tokens) {
              // Ensure we transform the tokens to preserve whitespace
              return tokens;
            },
          },
        ],
      });

      // Add CSS to preserve whitespace in code blocks
      const styledHighlightedCode = highlightedCode.replace(
        '<pre class="shiki',
        '<pre style="white-space: pre; tab-size: 2;" class="shiki'
      );

      // Replace the original code block with the highlighted version
      result = result.replace(fullMatch, styledHighlightedCode);
    } catch (error) {
      console.error("Syntax highlighting error:", error);
    }
  }

  return result;
}

/**
 * Add anchor links to headings (h1, h2, h3)
 */
function addAnchorLinksToHeadings(html: string): string {
  // Find heading tags (h1, h2, h3) in HTML
  const headingRegex = /<(h[1-2])>(.*?)<\/h[1-2]>/g;

  return html.replace(headingRegex, (match, tag, content) => {
    // Generate an ID from the heading content
    const id = content
      .toLowerCase()
      .replace(/[^\w\s-]/g, "") // Remove special characters
      .replace(/\s+/g, "-"); // Replace spaces with hyphens

    // Create the anchor element with the heading
    return `<${tag} id="${id}" class="group flex items-center relative">
      ${content}
      <a href="#${id}" class="anchor-link ml-2 opacity-0 group-hover:opacity-100 transition-opacity" aria-label="Link to this section">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
        </svg>
      </a>
    </${tag}>`;
  });
}

/**
 * Replace Notion page IDs with slugs in links
 */
async function replacePagesIdsWithSlugs(content: string): Promise<string> {
  // First check for Notion URLs
  if (content.includes('href="https://www.notion.so/')) {
    // Find all Notion page links in the HTML
    const notionLinkRegex =
      /href="https:\/\/www\.notion\.so\/([^"]*?)([a-zA-Z0-9]{32})([^"]*?)"/g;
    const pageIds = new Set<string>();
    let match;

    // Collect all page IDs
    while ((match = notionLinkRegex.exec(content)) !== null) {
      pageIds.add(match[2]);
    }

    if (pageIds.size > 0) {
      // Create a mapping of page IDs to slugs
      const idToSlugMap = new Map<string, string>();

      for (const pageId of pageIds) {
        try {
          // Try to get the page from Notion
          const page = await notion.pages.retrieve({ page_id: pageId });

          if (!page || !("properties" in page)) {
            continue;
          }

          // Extract the slug if available
          const slug = (page.properties.Slug as any)?.rich_text?.[0]
            ?.plain_text;
          if (slug) {
            idToSlugMap.set(pageId, slug);
          }
        } catch (error) {
          console.error(`Error fetching page ${pageId}:`, error);
          continue;
        }
      }

      // Replace all links with the corresponding slugs
      let result = content;
      for (const [pageId, slug] of idToSlugMap.entries()) {
        const notionUrlRegex = new RegExp(
          `href="https://www\\.notion\\.so/[^"]*?${pageId}[^"]*?"`,
          "g"
        );
        result = result.replace(notionUrlRegex, `href="/docs/${slug}"`);
      }

      content = result;
    }
  }

  // Now check for direct page ID links (without Notion domain)
  const directPageIdRegex = /href="\/([a-zA-Z0-9]{32})"/g;
  const directPageIds = new Set<string>();
  let directMatch;

  // Collect all direct page IDs
  while ((directMatch = directPageIdRegex.exec(content)) !== null) {
    directPageIds.add(directMatch[1]);
  }

  if (directPageIds.size > 0) {
    // Create a mapping of page IDs to slugs
    const idToSlugMap = new Map<string, string>();

    for (const pageId of directPageIds) {
      try {
        // Try to get the page from Notion
        const page = await notion.pages.retrieve({ page_id: pageId });

        if (!page || !("properties" in page)) {
          continue;
        }

        // Extract the slug if available
        const slug = (page.properties.Slug as any)?.rich_text?.[0]?.plain_text;
        if (slug) {
          idToSlugMap.set(pageId, slug);
        }
      } catch (error) {
        console.error(`Error fetching page ${pageId}:`, error);
        continue;
      }
    }

    // Replace all direct page ID links with the corresponding slugs
    let result = content;
    for (const [pageId, slug] of idToSlugMap.entries()) {
      const directLinkRegex = new RegExp(`href="/${pageId}"`, "g");
      result = result.replace(directLinkRegex, `href="/docs/${slug}"`);
    }

    return result;
  }

  return content;
}

/**
 * Processes HTML to replace special markers with proper spacing divs
 */
function processSpaceMarkers(html: string): string {
  // Convert our special space markers to proper div spaces
  return html.replace(/<!-- NOTION_SPACE -->/g, '<div class="my-0"></div>');
}

/**
 * Process the markdown to add extra line breaks for empty blocks
 */
function processMarkdownForEmptyLines(mdBlocks: any[]): any[] {
  const processedBlocks = [];
  let emptyBlockCount = 0;

  // Look for empty paragraph blocks in sequence and mark them
  for (let i = 0; i < mdBlocks.length; i++) {
    const block = mdBlocks[i];

    // Check if it's an empty paragraph (just a string with no content)
    const isEmpty = typeof block === "string" && block.trim() === "";

    if (isEmpty) {
      emptyBlockCount++;

      // Don't add empty blocks consecutively, but track how many we've seen
      continue;
    } else {
      // If we had empty blocks before this one, add extra line breaks
      if (emptyBlockCount > 0) {
        // Add a special empty block with extra newlines based on count
        const extraLineBreaks = "\n".repeat(emptyBlockCount * 2);
        processedBlocks.push(extraLineBreaks);
        emptyBlockCount = 0;
      }

      // Add the non-empty block
      processedBlocks.push(block);
    }
  }

  // If we had empty blocks at the end, add them too
  if (emptyBlockCount > 0) {
    const extraLineBreaks = "\n".repeat(emptyBlockCount * 2);
    processedBlocks.push(extraLineBreaks);
  }

  return processedBlocks;
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

    // Process blocks to handle empty lines before converting to markdown string
    const processedBlocks = processMarkdownForEmptyLines(mdBlocks);

    // Convert to markdown string
    const markdownResult = n2m.toMarkdownString(processedBlocks);

    // Convert markdown to HTML
    const htmlContent = marked.parse(markdownResult.parent) as string;

    // Add syntax highlighting to code blocks
    const contentWithSyntaxHighlighting =
      await addSyntaxHighlighting(htmlContent);

    // Process space markers in HTML
    const contentWithSpaces = processSpaceMarkers(
      contentWithSyntaxHighlighting
    );

    // Replace page IDs with slugs in links
    const contentWithSlugs = await replacePagesIdsWithSlugs(contentWithSpaces);

    // Add anchor links to headings
    const content = addAnchorLinksToHeadings(contentWithSlugs);

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
