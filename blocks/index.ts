import { registerChaiBlock } from "@chaibuilder/pages/builder";
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
import { Dropdown, DropdownConfig, DropdownProps } from "./dropdown/Dropdown";
import {
  Component as Modal,
  Config as ModalConfig,
  ModalProps,
} from "./modal/Modal";

export const registerBlocks = () => {
  registerChaiBlock<BlogsListProps>(BlogsList, BlogsListConfig);
  registerChaiBlock<ModalProps>(Modal, ModalConfig);
  registerChaiBlock<DropdownProps>(Dropdown, DropdownConfig);
  registerChaiBlock<AccordionProps>(Accordion, AccordionConfig);
};
