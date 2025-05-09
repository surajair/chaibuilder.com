import { registerChaiBlock } from "@chaibuilder/pages/runtime";
import {
  Accordion,
  AccordionConfig,
  AccordionProps,
} from "./accordion/Accordion";
import {
  BlogsList,
  BlogsListConfig,
  BlogsListProps,
} from "./blogs-grid/BlogsGrid";
import {
  DocsSidebar,
  DocsSidebarConfig,
  DocsSidebarProps,
} from "./docs-sidebar/docs-sidebar";
import { Dropdown, DropdownConfig, DropdownProps } from "./dropdown/Dropdown";
import {
  Component as Modal,
  Config as ModalConfig,
  ModalProps,
} from "./modal/Modal";
import {
  NotionContent,
  NotionContentConfig,
  NotionContentProps,
} from "./notion-content/notion-content";
export const registerBlocks = () => {
  registerChaiBlock<BlogsListProps>(BlogsList, BlogsListConfig);
  registerChaiBlock<ModalProps>(Modal, ModalConfig);
  registerChaiBlock<DropdownProps>(Dropdown, DropdownConfig);
  registerChaiBlock<AccordionProps>(Accordion, AccordionConfig);
  registerChaiBlock<DocsSidebarProps>(DocsSidebar, DocsSidebarConfig);
  registerChaiBlock<NotionContentProps>(NotionContent, NotionContentConfig);
};
