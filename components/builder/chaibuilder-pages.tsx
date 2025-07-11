"use client";
import { registerBlocks } from "@/blocks";
import { bluePreset, greenPreset, orangePreset } from "@/chai/theme-presets";
import { registerFonts } from "@/fonts";
import ChaiBuilderPages, {
  ChaiLibraryBlock,
  registerChaiLibrary,
} from "@chaibuilder/pages";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Logo } from "./logo";
import { startsWith } from "lodash";

registerBlocks();
registerFonts();

registerChaiLibrary("meraki-ui", {
  name: "Meraki UI",
  description: "Meraki UI",
  getBlocksList: async () => {
    try {
      const response = await fetch(
        "https://chai-ui-blocks.vercel.app/blocks.json"
      );
      const blocks = await response.json();
      return blocks.map((b: any) => ({
        ...b,
        preview: "https://chai-ui-blocks.vercel.app" + b.preview,
      }));
    } catch {
      return [];
    }
  },
  getBlock: async ({
    block,
  }: {
    block: ChaiLibraryBlock<{ path?: string; uuid: string }>;
  }) => {
    const response = await fetch(
      "https://chai-ui-blocks.vercel.app" +
        (!block.path ? "/" + block.uuid + ".html" : "/blocks/" + block.path)
    );
    const html = await response.text();
    return html.replace(/---([\s\S]*?)---/g, "");
  },
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  },
});

export default function ChaiBuilderPagesWrapper() {
  return (
    <QueryClientProvider client={queryClient}>
      <ChaiBuilderPages
        themePresets={[
          { orange: orangePreset as any },
          { green: greenPreset as any },
          { blue: bluePreset as any },
        ]}
        getPreviewUrl={(slug: string) => {
          return `/chai/api/preview?slug=${startsWith(slug, '/') ? slug : '/partial/' + slug}`
        }}
        getLiveUrl={(slug: string) => {
          return `/chai/api/preview?disable=true&slug=${startsWith(slug, '/') ? slug : '/partial/' + slug}`
        }}
        autoSaveSupport={false}
        logo={Logo}
      />
    </QueryClientProvider>
  );
}
