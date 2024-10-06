import { registerChaiBlock } from "@chaibuilder/runtime";
import { SingleLineText } from "@chaibuilder/runtime/controls";

const Card = ({ blockProps, title }: any) => {
  return (
    <div
      {...blockProps}
      className="flex flex-col bg-white border shadow-sm rounded-xl dark:bg-neutral-900 dark:border-neutral-700 dark:shadow-neutral-700/70"
    >
      <img
        className="w-full h-auto rounded-t-xl"
        src="https://images.unsplash.com/photo-1680868543815-b8666dba60f7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=320&q=80"
        alt="Card Image"
      />
      <div className="p-4 md:p-5">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white">
          {title}
        </h3>
        <p className="mt-1 text-gray-500 dark:text-neutral-400">
          Some quick example text to build on the card title and make up the
          bulk of the card content.
        </p>
        <a
          className="mt-2 py-2 px-3 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
          href="#"
        >
          Go somewhere
        </a>
      </div>
    </div>
  );
};

registerChaiBlock(Card, {
  type: "Card",
  label: "Card",
  group: "custom",
  category: "core",
  props: {
    title: SingleLineText({ title: "Card title", default: "Card title" }),
  },
});
