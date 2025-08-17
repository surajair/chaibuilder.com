import { getUser } from "@/actions/get-user-action";
import "@/app/(public)/public.css";
import TopNavigation from "@/components/top-navigation";
import type { Metadata } from "next";
import { Playfair_Display, Source_Sans_3 } from "next/font/google";
import type React from "react";

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-source-sans",
});

export const metadata: Metadata = {
  title: "Website Builder - Project Management",
  description: "Manage your website builder projects and settings",
  generator: "v0.app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUser();

  return (
    <body lang="en" className={`font-sans antialiased ${playfair.variable} ${sourceSans.variable}`}>
      <TopNavigation user={user} />
      <main className="h-full py-8">{children}</main>
    </body>
  );
}
