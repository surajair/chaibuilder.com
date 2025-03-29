import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  builderProp,
  ChaiBlock,
  ChaiBlockComponentProps,
  ChaiStyles,
  registerChaiBlock,
  registerChaiBlockSchema,
  StylesProp,
} from "@chaibuilder/pages/runtime";
import { CaretSortIcon } from "@radix-ui/react-icons";

export type AccordionProps = {
  children: React.ReactNode;
  styles: ChaiStyles;
  type: "single" | "multiple";
  show: boolean;
};

type AccordionTriggerProps = {
  children: React.ReactNode;
  styles: ChaiStyles;
  content: string;
};

type AccordionContentProps = {
  children: React.ReactNode;
  styles: ChaiStyles;
  content: string;
};

const AccordionTriggerComponent = (
  props: ChaiBlockComponentProps<AccordionTriggerProps>
) => {
  const { blockProps, content, children, styles } = props;
  return (
    <AccordionTrigger className="p-0 text-left hover:no-underline">
      <div {...blockProps} {...styles}>
        {children || content}
      </div>
    </AccordionTrigger>
  );
};

registerChaiBlock(AccordionTriggerComponent, {
  type: "AccordionTrigger",
  label: "Accordion Trigger",
  group: "advanced",
  category: "core",
  hidden: true,
  canMove: () => false,
  canDelete: () => false,
  canAcceptBlock: () => true,
  canDuplicate: () => false,
  ...registerChaiBlockSchema({
    properties: {
      styles: StylesProp(""),
      content: {
        type: "string",
        title: "Content",
        default: "Accordion Button",
      },
    },
  }),
  i18nProps: ["content"],
  aiProps: ["content"],
});

const AccordionContentComponent = (
  props: ChaiBlockComponentProps<AccordionContentProps>
) => {
  const { blockProps, children, styles, content } = props;

  return (
    <AccordionContent {...blockProps} {...styles}>
      {children || content}
    </AccordionContent>
  );
};

registerChaiBlock(AccordionContentComponent, {
  type: "AccordionContent",
  label: "Accordion Content",
  group: "advanced",
  hidden: true,
  canMove: () => false,
  canDelete: () => false,
  canAcceptBlock: () => true,
  canDuplicate: () => false,
  ...registerChaiBlockSchema({
    properties: {
      styles: StylesProp(""),
      content: {
        type: "string",
        title: "Title",
        default: "This is accordion content",
      },
    },
  }),
  i18nProps: ["content"],
  aiProps: ["content"],
});

const Component = (props: ChaiBlockComponentProps<AccordionProps>) => {
  const { _id, show, styles, children, blockProps, inBuilder } = props;
  return (
    <Accordion
      type="single"
      collapsible={inBuilder && show ? false : true}
      {...(inBuilder ? { value: show ? _id : "" } : {})}>
      <AccordionItem
        value={_id}
        className="border-0"
        {...(inBuilder ? { open: show } : {})}>
        <div {...blockProps} {...styles}>
          {children}
        </div>
      </AccordionItem>
    </Accordion>
  );
};

const Config = {
  type: "Accordion",
  label: "Accordion",
  group: "advanced",
  category: "core",
  wrapper: true,
  icon: CaretSortIcon,
  blocks: () =>
    [
      {
        _type: "Accordion",
        _id: "accordion",
        styles: "#styles:,w-full border-b",
      },
      {
        _type: "AccordionTrigger",
        _id: "accordion-item",
        _parent: "accordion",
        content: "Accordion Button",
        styles: "#styles:,w-full overflow-x-hidden hover:underline py-4",
      },
      {
        _type: "AccordionContent",
        _id: "accordion-content",
        styles: "#styles:,w-full pb-4",
        _parent: "accordion",
        content: "This is accordion content",
      },
    ] as ChaiBlock[],
  ...registerChaiBlockSchema({
    properties: {
      show: builderProp({
        type: "boolean",
        title: "Expand Accordion",
        default: false,
      }),
      styles: StylesProp("relative w-max"),
    },
  }),
};

export { Component as Accordion, Config as AccordionConfig };
