import { DocLink } from "@/blocks/docs-sidebar/nav-item";
import { Client } from "@notionhq/client";

// Extended DocLink interface with related docs
interface ExtendedDocLink extends DocLink {
  related?: string[];
}

// Initialize Notion client
export const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

export const databaseId = process.env.NOTION_DATABASE_ID;
