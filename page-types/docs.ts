import { registerChaiPageType } from "@chaibuilder/pages/server";

registerChaiPageType("docs", {
  name: "Documentation",
  helpText: "A documentation page.",
  dynamicSegments: "/[a-z0-9]+(?:-[a-z0-9]+)*$", // regex for slug. starts with / and should contain only lowercase letters, numbers and hyphens
  dynamicSlug: "{{slug}}",
  dataProvider: async () => {
    return {
      docs: {
        title: "Getting Started with Chai Builder & Next.js",
        content: `
        <p>
          Next.js uses file-system based routing, meaning you can use folders and files to define routes. This page will guide you through how to create layouts and pages, and link between them.
        </p>
        <p>
         A page is UI that is rendered on a specific route. To create a page, add a page file inside the app directory and default export a React component. For example, to create an index page (/):
        </p>
        <p>
          A layout is UI that is shared between multiple pages. On navigation, layouts preserve state, remain interactive, and do not rerender.

You can define a layout by default exporting a React component from a layout file. The component should accept a children prop which can be a page or another layout.

For example, to create a layout that accepts your index page as child, add a layout file inside the app directory:
        </p>
        `,
      },
    };
  },
});
