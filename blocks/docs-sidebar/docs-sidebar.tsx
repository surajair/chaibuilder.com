import { cn } from "@/lib/utils";
import {
  ChaiBlockComponentProps,
  registerChaiBlockSchema,
} from "@chaibuilder/pages/runtime";
import { DocLink, NavItem } from "./nav-item";

export type DocsSidebarProps = {
  items: DocLink[];
  title: string;
};

const DocsSidebar = (props: ChaiBlockComponentProps<DocsSidebarProps>) => {
  const { blockProps } = props;
  return (
    <div {...blockProps} className={cn("w-full")}>
      {props.title && (
        <h4 className="text-sm pl-2 border-b mb-1 border-border pb-2 mr-6 font-medium text-muted-foreground">
          {props.title}
        </h4>
      )}
      <div className="space-y-1 mr-6">
        {props.items?.map((item, i) => (
          <NavItem key={i} item={item} inBuilder={props.inBuilder} />
        ))}
      </div>
    </div>
  );
};

const DocsSidebarConfig = {
  type: "DocsSidebar",
  label: "Docs Sidebar",
  group: "docs",
  category: "core",
  pageTypes: ["docs"],
  ...registerChaiBlockSchema({
    properties: {
      title: {
        type: "string",
        label: "Title",
        default: "Untitled",
      },
    },
  }),
  dataProvider: () => {
    return {
      items: [
        {
          title: "Introduction",
          href: "#",
        },
        {
          title: "Getting Started",
          items: [
            { title: "Introduction", href: "#" },
            { title: "Getting Started", href: "#" },
          ],
        },
      ],
    };
  },
};

export { DocsSidebar, DocsSidebarConfig };
