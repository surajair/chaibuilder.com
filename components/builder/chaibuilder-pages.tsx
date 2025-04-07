"use client";
import { registerBlocks } from "@/blocks";
import { bluePreset, greenPreset, orangePreset } from "@/chai/theme-presets";
import { registerFonts } from "@/fonts";
import { useSupabaseAuth } from "@/hooks/use-supabase-auth";
import ChaiBuilderPages, { registerChaiSidebarPanel } from "@chaibuilder/pages";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { Logo } from "./logo";
import UserAvatarMenu from "./sign-out";

registerBlocks();
registerFonts();
registerChaiSidebarPanel("sign-out", {
  button: UserAvatarMenu,
  position: "bottom",
  label: "Sign Out",
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  },
});

const Login = dynamic(() => import("@/components/builder/login"), {
  ssr: false,
});

export default function ChaiBuilderPagesWrapper() {
  const { isLoggedIn, user } = useSupabaseAuth();
  if (!isLoggedIn) return <Login logo={<Logo width={50} height={50} />} />;
  return (
    <QueryClientProvider client={queryClient}>
      <ChaiBuilderPages
        themePresets={[
          { orange: orangePreset },
          { green: greenPreset },
          { blue: bluePreset },
        ]}
        getPreviewUrl={(slug: string) => `/chai/api/preview?slug=${slug}`}
        autoSaveSupport={false}
        logo={Logo}
        user={{
          id: user?.id || "",
          name: user?.name || "",
          email: user?.email || "",
          authToken: user?.authToken || "",
        }}
        onSessionExpired={() => window.location.reload()}
      />
    </QueryClientProvider>
  );
}
