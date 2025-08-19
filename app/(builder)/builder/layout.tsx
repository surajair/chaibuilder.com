import type { Metadata } from "next";
import { Geist } from "next/font/google";
import ChaiBuilder from "chai-next/server";

import "./builder.css";

const geist = Geist({ subsets: ["latin"] });
ChaiBuilder.init(process.env.CHAIBUILDER_API_KEY!);

export const metadata: Metadata = {
  title: "Chai Builder",
  description: "Low Code Website Builder for Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={geist.className}>{children}</body>
    </html>
  );
}
