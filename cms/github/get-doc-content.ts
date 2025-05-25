import matter from "gray-matter";
import { marked } from "marked";
import { codeToHtml } from "shiki";

interface DocContent {
  title: string;
  content: string;
  editLinkMarkup: string;
  publishedDate?: string;
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

export const getDocContent = async (
  slug: string,
  title: string = ""
): Promise<DocContent | null> => {
  try {
    // Get GitHub token from environment variable
    const githubToken = process.env.GITHUB_TOKEN;

    const headers: HeadersInit = {};
    if (githubToken) {
      headers["Authorization"] = `token ${githubToken}`;
    }

    let fileSlug = slug;
    let filePath = "";

    // Fetch the docs.json file to find the correct file path
    const docsJsonResponse = await fetch(
      `https://raw.githubusercontent.com/chaibuilder/docs/main/docs.json`,
      { headers, cache: "force-cache" }
    );

    if (!docsJsonResponse.ok) {
      throw new Error(`Failed to fetch docs.json: ${docsJsonResponse.status}`);
    }

    const docsData = await docsJsonResponse.json();

    if (!Array.isArray(docsData)) {
      throw new Error("Invalid docs.json structure");
    }

    // Function to recursively search for a document by slug
    const findDocumentBySlug = (items: any[], targetSlug: string): any => {
      // Normalize the target slug for comparison
      // Remove leading and trailing slashes, and 'docs/' prefix if present
      const normalizedTargetSlug = targetSlug
        .replace(/^\/+|\/+$/g, "") // Remove leading/trailing slashes
        .replace(/^docs\//i, ""); // Remove 'docs/' prefix if present

      for (const item of items) {
        // Normalize the item slug for comparison
        const itemSlug = (item.slug || "")
          .replace(/^\/+|\/+$/g, "") // Remove leading/trailing slashes
          .replace(/^docs\//i, ""); // Remove 'docs/' prefix if present

        // Check if this item matches the slug
        if (itemSlug === normalizedTargetSlug) {
          return item;
        }

        // Also check if the last part of the path matches (for leaf nodes)
        if (item.path) {
          const pathParts = item.path.split("/");
          const lastPart = pathParts[pathParts.length - 1]
            .replace(/\.md$/, "") // Remove .md extension
            .replace(/^\d+-/, ""); // Remove numeric prefix

          const targetParts = normalizedTargetSlug.split("/");
          const targetLastPart = targetParts[targetParts.length - 1];

          if (lastPart === targetLastPart) {
            return item;
          }
        }

        // If this item has children, search them
        if (item.children && Array.isArray(item.children)) {
          const found = findDocumentBySlug(item.children, targetSlug);
          if (found) return found;
        }
      }

      return null;
    };

    // Search for the document in the docs.json structure
    const document = findDocumentBySlug(docsData, slug);

    if (document && document.path) {
      // Use the path from docs.json which includes the numeric prefixes
      filePath = document.path;
      // Extract the fileSlug from the path (remove the /docs/ prefix and .md suffix)
      fileSlug = document.slug;
    } else {
      console.warn(`Document not found in docs.json for slug: ${slug}`);
      // Fall back to the original slug if not found in docs.json
    }

    // Use the path from docs.json if available, otherwise construct from fileSlug
    const fetchPath = document ? document.path : `${fileSlug}.md`;

    const markdownResult = await fetch(
      `https://raw.githubusercontent.com/chaibuilder/docs/refs/heads/main/${fetchPath}`,
      { headers }
    );

    const matterResult = matter(await markdownResult.text());

    // Convert markdown to HTML
    const htmlContent = marked.parse(matterResult.content) as string;

    // Add syntax highlighting to code blocks
    const contentWithSyntaxHighlighting =
      await addSyntaxHighlighting(htmlContent);

    // Add anchor links to headings
    const content = addAnchorLinksToHeadings(contentWithSyntaxHighlighting);

    return {
      title: matterResult.data.title,
      content,
      editLinkMarkup: `<a href="https://github.com/chaibuilder/docs/edit/main${fetchPath}" class="flex items-center gap-2" target="_blank" rel="noopener noreferrer">
       <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-square-pen-icon lucide-square-pen"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"/></svg>
        Edit this page on GitHub
      </a>`,
    };
  } catch (error) {
    console.error("Error fetching document content:", error);
    return null;
  }
};
