import { ChaiBlock } from "@chaibuilder/sdk";
import { BlogsList } from "../blogs-grid/BlogsGrid";

const BlogsListConfig = {
  type: "BlogsList",
  dataProvider: async (block: ChaiBlock) => {
    const { blogCount } = block;
    const response = await fetch("https://jsonplaceholder.typicode.com/photos");
    // pick on 10 posts
    const data = await response.json();
    const posts = data.slice(0, blogCount || 3);
    const blogs = posts.map(
      (item: {
        id: string;
        title: string;
        url: string;
        thumbnailUrl: string;
      }) => ({
        id: item.id,
        title: item.title,
        url: item.url,
        thumbnailUrl: item.thumbnailUrl,
      })
    );
    return { blogs, $metadata: { pageType: "BlogsList" } };
  },
};

export { BlogsList, BlogsListConfig };
