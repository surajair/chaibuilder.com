"use client";
import { registerBlocks } from "@/blocks";
import { bluePreset, greenPreset, orangePreset } from "@/chai/theme-presets";
import { registerFonts } from "@/fonts";
import ChaiBuilderPages from "@chaibuilder/pages";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Logo } from "./logo";

registerBlocks();
registerFonts();

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
        getPreviewUrl={(slug: string) => `/chai/api/preview?slug=${slug}`}
        autoSaveSupport={false}
        logo={Logo}
      />
    </QueryClientProvider>
  );
}
