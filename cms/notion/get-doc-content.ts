import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { marked } from "marked";
import { NotionToMarkdown } from "notion-to-md";
import { codeToHtml } from "shiki";
import { databaseId, notion } from "./notion";

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
    const htmlContent = marked.parse(markdown.parent) as string;

    // Add syntax highlighting to code blocks
    const content = await addSyntaxHighlighting(htmlContent);

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
