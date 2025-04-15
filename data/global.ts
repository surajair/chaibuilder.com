import { registerChaiGlobalDataProvider } from "@chaibuilder/pages/server";
import { unstable_cache as nextCache } from "next/cache";
import { cache } from "react";

const globalDataProvider = cache(async ({ lang }: { lang: string }) => {
  console.log("lang", lang);
  return await nextCache(
    async () => {
      return {
        name: "Chai Builder",
        address: "Pune, Maharashtra, India",
        email: "support@chaibuilder.com",
        social: {
          facebook: "https://www.facebook.com/chaibuilder",
          instagram: "https://www.instagram.com/chaibuilder",
          x: "https://x.com/chaibuilder",
        },
      };
    },
    ["global-site-data"],
    { tags: ["global-site-data"] }
  )();
});

registerChaiGlobalDataProvider(globalDataProvider);
