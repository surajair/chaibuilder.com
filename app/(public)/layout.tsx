import "@/data";
import { chaiBuilderPages, getChaiSiteSettings } from "@/lib/chaibuilder";
import {
  getChaiThemeCssVariables,
  getThemeFontsCSSImport,
} from "@chaibuilder/sdk/render";
import { get } from "lodash";
import { draftMode } from "next/headers";
import "./globals.css";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isEnabled } = await draftMode();

  //IMPORTANT: This is an important step to set the draft mode for the page.
  //Without this, the page will always be in live mode
  chaiBuilderPages.setDraftMode(isEnabled);

  const siteSettings = await getChaiSiteSettings();
  if ("error" in siteSettings) {
    console.error(siteSettings.error);
  }
  chaiBuilderPages.setFallbackLang(get(siteSettings, "fallbackLang", ""));

  // Add empty theme object as fallback
  const theme = get(siteSettings, "theme", {});
  const themeCssVariables = getChaiThemeCssVariables(theme);
  return (
    <html lang="en" className={`smooth-scroll`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <style
          id="theme-fonts"
          dangerouslySetInnerHTML={{
            __html: getThemeFontsCSSImport(theme) + themeCssVariables,
          }}
        />
        <meta
          name="format-detection"
          content="telephone=no, date=no, email=no, address=no"
        />
      </head>
      <body className="font-body antialiased">{children}</body>
    </html>
  );
}
