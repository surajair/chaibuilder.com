import "@/app/(public)/public.css";
import { getChaiSiteSettings } from "@/chai";
import { getChaiThemeCssVariables } from "@chaibuilder/sdk/render";
import { get } from "lodash";
import { Metadata } from "next";
import { Toaster } from "sonner";
export const metadata: Metadata = {
  title: "Chaibuilder - Login",
  description: "Authentication pages for Chaibuilder",
};

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const siteSettings = await getChaiSiteSettings();
  if ("error" in siteSettings) {
    console.error(siteSettings.error);
  }
  const theme = get(siteSettings, "theme", {});
  const themeCssVariables = getChaiThemeCssVariables(theme);
  return (
    <html dir="ltr" className="smooth-scroll">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <style
          id="theme-colors"
          dangerouslySetInnerHTML={{ __html: themeCssVariables }}
        />
      </head>
      <body className="font-sans antialiased">
        <Toaster />
        {children}
      </body>
    </html>
  );
}
