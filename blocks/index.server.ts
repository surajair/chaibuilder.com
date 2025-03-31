import {
  registerChaiServerBlock,
  setChaiServerBlockDataProvider,
} from "@chaibuilder/pages/runtime";

import { blogsGridDataProvider } from "./blogs-grid/data-provider";
import { docsSidebarDataProvider } from "./docs-sidebar/data-provider";
import { ImageBlock, ImageConfig } from "./image/Image";
import { LinkBlock, LinkConfig } from "./link/Link";
export const registerServerBlocks = () => {
  if (typeof window !== "undefined") {
    throw new Error("Index.server.ts is a server-only file");
  }
  registerChaiServerBlock(ImageBlock, ImageConfig);
  registerChaiServerBlock(LinkBlock, LinkConfig);

  //set Data Provider for RSC blocks
  setChaiServerBlockDataProvider("BlogsList", blogsGridDataProvider);
  setChaiServerBlockDataProvider("DocsSidebar", docsSidebarDataProvider);
};
