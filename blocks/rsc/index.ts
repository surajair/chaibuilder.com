import { registerChaiServerBlock } from "@chaibuilder/pages/runtime";

import { BlogsList, BlogsListConfig } from "./BlogsList";
import { ImageBlock, ImageConfig } from "./Image";
import { LinkBlock, LinkConfig } from "./Link";

export const registerServerBlocks = () => {
  registerChaiServerBlock(ImageBlock, ImageConfig);
  registerChaiServerBlock(LinkBlock, LinkConfig);
  registerChaiServerBlock(BlogsList, BlogsListConfig);
};
