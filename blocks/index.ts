import { registerChaiBlock } from "chai-next/blocks";
import {
  DocsSidebar,
  DocsSidebarConfig,
  DocsSidebarProps,
} from "./docs-sidebar/docs-sidebar";

export const registerBlocks = () => {
  registerChaiBlock<DocsSidebarProps>(DocsSidebar, DocsSidebarConfig);
};
