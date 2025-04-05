"use client";
import { registerBlocks } from "@/blocks";
import { bluePreset, greenPreset, orangePreset } from "@/chai/theme-presets";
import { registerFonts } from "@/fonts";
import { useBuilderAuth } from "@/hooks/use-builder-auth";
import ChaiBuilderPages from "@chaibuilder/pages";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { Logo } from "./logo";
import UserAvatarMenu from "./sign-out";

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

const MediaManager = dynamic(
  () => import("@/components/builder/media-manager"),
  { ssr: false }
);
const Login = dynamic(() => import("@/components/builder/login"), {
  ssr: false,
});

export default function ChaiBuilderPagesWrapper() {
  const { isLoggedIn, user } = useBuilderAuth();
  if (!isLoggedIn) return <Login logo={Logo} />;
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
        mediaManagerComponent={MediaManager}
        logo={Logo}
        sidebarBottomComponents={[UserAvatarMenu]}
        user={{
          id: user.id,
          name: user.name,
          email: user.email,
          authToken: user.authToken,
          role: "admin",
          permissions: [],
        }}
        onSessionExpired={() => window.location.reload()}
      />
    </QueryClientProvider>
  );
}
