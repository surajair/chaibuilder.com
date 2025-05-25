import {
  ChaiBlockComponentProps,
  ChaiStyles,
  registerChaiBlockSchema,
  StylesProp,
} from "@chaibuilder/pages/runtime";

type AsyncProp<T> = T | undefined;

export type BlogsListProps = {
  heading: string;
  blogCount: number;
  showBlogLink: boolean;
  hideReadMore: boolean;
  cardStyles: ChaiStyles;
  imageStyles: ChaiStyles;
  containerStyles: ChaiStyles;
  headingStyles: ChaiStyles;
  blogs: AsyncProp<
    {
      id: string;
      title: string;
      url: string;
      thumbnailUrl: string;
    }[]
  >;
};

const i18nTranslations: { [key: string]: { [key: string]: string } } = {
  fr: { heading: "This is a dynamic block in French" },
  en: { heading: "This is a dynamic block in English" },
};

export const BlogsList = (props: ChaiBlockComponentProps<BlogsListProps>) => {
  return (
    <div {...props.blockProps} {...props.containerStyles}>
      <div className="max-w-2xl mx-auto mb-10 text-center lg:mb-14">
        <h2 {...props.headingStyles}>{props.heading}</h2>
        <h3>{i18nTranslations[props.lang]?.heading}</h3>
      </div>

      <div className="grid gap-6 sm:grid-cols-3 lg:grid-cols-3">
        {props.blogs?.map(
          (blog: {
            id: string;
            title: string;
            url: string;
            thumbnailUrl: string;
          }) => (
            <div key={blog.id} {...props.cardStyles}>
              <div className="relative pt-[50%] sm:pt-[70%] rounded-xl overflow-hidden">
                <img
                  loading="lazy"
                  {...props.imageStyles}
                  src={blog.thumbnailUrl}
                  alt="Blog Image"
                />
                <span className="absolute top-0 end-0 rounded-se-xl rounded-es-xl text-xs font-medium bg-red-500 text-secondary-foreground py-1.5 px-3">
                  Sponsored
                </span>
              </div>

              <div className="mt-7">
                <h3 className="text-xl font-semibold">{blog.title}</h3>
                <p className="mt-3 text-primary">{blog.url}</p>
                {!props.hideReadMore && (
                  <p className="inline-flex items-center mt-5 text-sm font-medium gap-x-1 decoration-2 group-hover:underline group-focus:underline">
                    Read more
                    <svg
                      className="shrink-0 size-4"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round">
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </p>
                )}
              </div>
            </div>
          )
        )}
      </div>
      {props.showBlogLink && (
        <div className="mt-10 text-center">
          <a href="#" className="text-secondary">
            View all blogs
          </a>
        </div>
      )}
    </div>
  );
};

export const BlogsListConfig = {
  type: "BlogsList",
  label: "Blogs List",
  group: "Custom",
  category: "core",
  dataProvider: () => {
    return {
      blogs: [
        {
          albumId: 1,
          id: 4,
          title: "culpa odio esse rerum omnis laboriosam voluptate repudiandae",
          url: "https://picsum.photos/200/301",
          thumbnailUrl: "https://picsum.photos/200/301",
        },
        {
          albumId: 1,
          id: 5,
          title: "natus nisi omnis corporis facere molestiae rerum in",
          url: "https://picsum.photos/200/302",
          thumbnailUrl: "https://picsum.photos/200/302",
        },
        {
          albumId: 1,
          id: 6,
          title: "accusamus ea aliquid et amet sequi nemo",
          url: "https://picsum.photos/200/303",
          thumbnailUrl: "https://picsum.photos/200/303",
        },
      ],
    };
  },
  ...registerChaiBlockSchema({
    properties: {
      containerStyles: StylesProp(
        "max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto"
      ),
      cardStyles: StylesProp("group flex flex-col focus:outline-none"),
      imageStyles: StylesProp(
        "size-full absolute top-0 start-0 object-cover group-hover:scale-105 group-focus:scale-105 transition-transform duration-500 ease-in-out rounded-xl"
      ),
      headingStyles: StylesProp(
        "text-2xl font-bold md:text-4xl md:leading-tight dark:text-white"
      ),
      heading: {
        type: "string",
        default: "This is a dynamic block",
        title: "Heading",
      },
      blogCount: {
        type: "number",
        default: 9,
        title: "Blog Count",
      },
      showBlogLink: {
        type: "boolean",
        default: true,
        title: "Show Blog Link",
      },
      hideReadMore: {
        type: "boolean",
        default: false,
        title: "Hide Read More",
      },
    },
  }),
  i18nProps: ["heading"],
  aiProps: ["heading"],
};
