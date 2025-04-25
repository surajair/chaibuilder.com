import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  builderProp,
  ChaiBlock,
  ChaiBlockComponentProps,
  ChaiRuntimeProp,
  ChaiStyles,
  closestBlockProp,
  registerChaiBlock,
  registerChaiBlockSchema,
  StylesProp,
} from "@chaibuilder/pages/runtime";
import { DropdownMenuIcon } from "@radix-ui/react-icons";

export type DropdownLinksProps = {
  showDropdown: ChaiRuntimeProp<boolean>;
  children: React.ReactNode;
  styles: ChaiStyles;
};

const DropdownButton = (
  props: ChaiBlockComponentProps<{
    content: string;
    icon: string;
    iconWidth: string;
    iconHeight: string;
    styles: ChaiStyles;
    show: ChaiRuntimeProp<boolean>;
  }>
) => {
  const { blockProps, content, icon, iconWidth, iconHeight, styles } = props;
  return (
    <DropdownMenuTrigger {...blockProps} {...styles}>
      {content}
      <span
        dangerouslySetInnerHTML={{ __html: icon }}
        style={{ width: iconWidth, height: iconHeight }}
        className="transition-transform duration-200 ease-in-out"
      />
    </DropdownMenuTrigger>
  );
};

registerChaiBlock(DropdownButton, {
  type: "DropdownButton",
  label: "Dropdown Button",
  group: "advanced",
  category: "core",
  hidden: true,
  canMove: () => false,
  canDelete: () => false,
  ...registerChaiBlockSchema({
    properties: {
      show: closestBlockProp("Dropdown", "showDropdown"),
      content: { type: "string", title: "Title", default: "Menu Item" },
      icon: {
        type: "string",
        title: "Icon",
        default: "",
        ui: { "ui:widget": "icon" },
      },
      iconWidth: { type: "string", title: "Icon Width", default: "16px" },
      iconHeight: { type: "string", title: "Icon Height", default: "16px" },
      styles: StylesProp("flex items-center gap-2 px-4 py-1"),
    },
  }),
  i18nProps: ["content"],
  aiProps: ["content"],
});

const DropdownContent = (
  props: ChaiBlockComponentProps<{
    children: React.ReactNode;
    styles: ChaiStyles;
    show: ChaiRuntimeProp<boolean>;
  }>
) => {
  const { blockProps, children, styles } = props;

  return (
    <DropdownMenuContent {...blockProps} {...styles}>
      {children}
    </DropdownMenuContent>
  );
};

registerChaiBlock(DropdownContent, {
  type: "DropdownContent",
  label: "Dropdown Content",
  group: "basic",
  hidden: true,
  canMove: () => false,
  canDelete: () => false,
  canAcceptBlock: () => true,
  ...registerChaiBlockSchema({
    properties: {
      show: closestBlockProp("Dropdown", "showDropdown"),
      styles: StylesProp("w-80 mt-0.5 bg-white rounded-lg shadow-lg z-50"),
    },
  }),
});

const Component = (props: ChaiBlockComponentProps<DropdownLinksProps>) => {
  const { blockProps, showDropdown, children, styles, inBuilder } = props;
  return (
    <DropdownMenu {...(inBuilder ? { open: showDropdown } : {})}>
      <div {...blockProps} {...styles}>
        {children}
      </div>
    </DropdownMenu>
  );
};

export type DropdownProps = {
  showDropdown: ChaiRuntimeProp<boolean>;
  children: React.ReactNode;
  styles: ChaiStyles;
};

const Config = {
  type: "Dropdown",
  label: "Dropdown",
  group: "basic",
  icon: DropdownMenuIcon,
  blocks: () =>
    [
      { _type: "Dropdown", _id: "dropdown" },
      {
        _type: "DropdownButton",
        _id: "button",
        _parent: "dropdown",
        title: "Menu Item",
        icon: `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24"> <path d="M16.293 9.293 12 13.586 7.707 9.293l-1.414 1.414L12 16.414l5.707-5.707z"/> </svg>`,
        styles: "#styles:,flex items-center gap-2 px-4 py-1",
      },
      {
        _type: "DropdownContent",
        _id: "content",
        _parent: "dropdown",
        styles: "#styles:,w-80 mt-0.5 bg-white rounded-lg shadow-lg z-50",
      },
      {
        _type: "Link",
        _id: "link",
        _parent: "content",
        content: "Link",
        styles: "#styles:,flex items-center gap-2 px-4 py-1",
        link: { href: "https://www.google.com", type: "url", target: "_self" },
      },
    ] as ChaiBlock[],
  category: "core",
  wrapper: true,
  ...registerChaiBlockSchema({
    properties: {
      showDropdown: builderProp({
        type: "boolean",
        title: "Show Dropdown",
        default: false,
      }),
      styles: StylesProp("relative w-max"),
    },
  }),
};

export { Component as Dropdown, Config as DropdownConfig };
