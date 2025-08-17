'use server';
import { setChaiServerBlockDataProvider } from "chai-next/blocks";
import { docsSidebarDataProvider } from "./docs-sidebar/data-provider";

export const registerServerBlocks = () => {
  // @ts-ignore
  setChaiServerBlockDataProvider("DocsSidebar", docsSidebarDataProvider);
};
