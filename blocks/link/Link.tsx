import { chaiBuilderPages } from "@/chai";
import {
  ChaiBlockComponentProps,
  ChaiStyles,
} from "@chaibuilder/pages/runtime";
import Link from "next/link";
import * as React from "react";

type LinkProps = {
  styles: ChaiStyles;
  content: string;
  link: {
    type: "page" | "pageType" | "url" | "email" | "phone" | "element";
    target: "_self" | "_blank";
    href: string;
  };
};

export const LinkBlock = async (props: ChaiBlockComponentProps<LinkProps>) => {
  const { link, styles, children, content } = props;
  const isPageTypeLink = link?.type === "pageType" && link?.href !== "";
  let href = link?.href;
  if (isPageTypeLink) {
    href = await chaiBuilderPages.resolvePageLink(href, props.lang);
  }
  if (children) {
    return (
      <Link
        href={href || "#/"}
        target={link?.target}
        aria-label={content}
        {...styles}>
        {children}
      </Link>
    );
  }

  return React.createElement(
    Link,
    {
      ...styles,
      href: href,
      target: link?.target || "_self",
      "aria-label": content,
    },
    content
  );
};

export const LinkConfig = {
  type: "Link",
  label: "Link",
  group: "basic",
  schema: {
    properties: {
      link: {
        type: "object",
        title: "Link",
      },
    },
  },
  i18nProps: ["content"],
};
