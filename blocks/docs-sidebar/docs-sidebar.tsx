import { ChaiBlockComponentProps } from "@chaibuilder/pages/runtime";
import { DocLink, DocsSidebarClient } from "./docs-sidebar.client";

export type DocsSidebarProps = {
  links: DocLink[];
};

const DocsSidebar = (props: ChaiBlockComponentProps<DocsSidebarProps>) => {
  return <DocsSidebarClient {...props} />;
};

const DocsSidebarConfig = {
  type: "DocsSidebar",
  label: "Docs Sidebar",
  group: "docs",
  category: "core",
  pageTypes: ["docs"],
  dataProvider: () => {
    return {
      links: [
        {
          title: "Getting Started",
          items: [
            {
              title: "Introduction",
              href: "/docs/introduction",
            },
            {
              title: "Installation",
              href: "/docs/installation",
            },
          ],
        },
        {
          title: "Components",
          items: [
            {
              title: "UI Components",
              items: [
                {
                  title: "Button",
                  href: "/docs/components/button",
                },
                {
                  title: "Card",
                  href: "/docs/components/card",
                },
                {
                  title: "Input",
                  href: "/docs/components/input",
                },
              ],
            },
            {
              title: "Layout Components",
              items: [
                {
                  title: "Container",
                  href: "/docs/components/container",
                },
                {
                  title: "Grid",
                  href: "/docs/components/grid",
                },
              ],
            },
          ],
        },
        {
          title: "API Reference",
          items: [
            {
              title: "Authentication",
              href: "/docs/api/authentication",
            },
            {
              title: "Endpoints",
              href: "/docs/api/endpoints",
            },
          ],
        },
      ],
    };
  },
};

export { DocsSidebar, DocsSidebarConfig };
