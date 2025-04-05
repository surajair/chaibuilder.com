"use client";

import FullScreenLoader from "@/components/builder/loader";
import dynamic from "next/dynamic";

const ChaiBuilderPages = dynamic(
  () => import("@/components/builder/chaibuilder-pages"),
  { ssr: false, loading: () => <FullScreenLoader /> }
);

export default function Page() {
  return <ChaiBuilderPages />;
}
