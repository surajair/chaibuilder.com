import "@/app/(public)/public.css";
import { getChaiSiteSettings } from "@/chai";
import { getFontHref, getThemeCustomFontFace } from "@/utils/styles-helper";
import { getChaiThemeCssVariables } from "@chaibuilder/sdk/render";
import { get } from "lodash";
import { Metadata } from "next";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Chaibuilder - Websites",
  description: "Manage your Chaibuilder websites",
};

export default async function DashboardLayout({
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
  const bodyFont = get(theme, "fontFamily.body", "Inter");
  const headingFont = get(theme, "fontFamily.heading", "Inter");
  const fontUrls = getFontHref([bodyFont, headingFont]);
  const customFontFace = getThemeCustomFontFace([bodyFont, headingFont]);

  return (
    <html dir="ltr" className="smooth-scroll">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        {fontUrls.map((fontUrl: string) => (
          <link
            key={fontUrl}
            rel="preload"
            href={fontUrl}
            as="style"
            crossOrigin=""
          />
        ))}

        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <style
          id="theme-colors"
          dangerouslySetInnerHTML={{ __html: themeCssVariables }}
        />
        {fontUrls.map((fontUrl: string) => (
          <link key={fontUrl} rel="stylesheet" href={fontUrl} />
        ))}
        <style
          id="custom-font-face"
          dangerouslySetInnerHTML={{ __html: customFontFace }}
        />
      </head>
      <body className="font-body antialiased">
        <Toaster />
        {children}
      </body>
    </html>
  );
}
