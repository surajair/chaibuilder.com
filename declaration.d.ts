import "@chaibuilder/pages/runtime";

declare module "@chaibuilder/pages/runtime" {
  interface ChaiPageProps {
    slug: string;
    pageType: string;
    fallbackLang: string;
  }
}
