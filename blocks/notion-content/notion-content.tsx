import {
  ChaiBlockComponentProps,
  registerChaiBlockSchema,
} from "@chaibuilder/pages/runtime";

export type NotionContentProps = {
  content: string;
};

export const NotionContent = (
  props: ChaiBlockComponentProps<NotionContentProps>
) => {
  return (
    <div
      {...props.blockProps}
      className="prose max-w-none prose-headings:my-2 prose-headings:mt-6 prose-p:my-px prose-hr:my-2 prose-ul:my-px prose-ol:my-px prose-a:text-blue-600"
      dangerouslySetInnerHTML={{ __html: props.content }}
    />
  );
};

export const NotionContentConfig = {
  type: "NotionContent",
  label: "Notion Content",
  group: "Content",
  ...registerChaiBlockSchema({
    properties: {
      content: {
        type: "string",
        title: "Content",
        description: "The content of the document",
        default: "",
      },
    },
  }),
  i18nPorps: ["content"],
};
