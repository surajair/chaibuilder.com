import { registerChaiBlock } from "@chaibuilder/pages/builder";
import { BlogsList, BlogsListConfig, BlogsListProps } from "./BlogsList";
import { Accordion, AccordionConfig, AccordionProps } from "./shadcn/Accordion";
import { Dropdown, DropdownConfig, DropdownProps } from "./shadcn/Dropdown";
import {
  Component as Modal,
  Config as ModalConfig,
  ModalProps,
} from "./shadcn/Modal";

export const registerBlocks = () => {
  registerChaiBlock<BlogsListProps>(BlogsList, BlogsListConfig);
  registerChaiBlock<ModalProps>(Modal, ModalConfig);
  registerChaiBlock<DropdownProps>(Dropdown, DropdownConfig);
  registerChaiBlock<AccordionProps>(Accordion, AccordionConfig);
};
