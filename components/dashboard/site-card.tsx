"use client";
import { SiteDetailsModal } from "@/components/dashboard/site-detail-modal";
import { SiteMenu } from "@/components/dashboard/site-menu";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Site } from "@/utils/types";
import Link from "next/link";
import { useState } from "react";

function isNew(site: Site) {
  return (
    new Date().getTime() - new Date(site.createdAt).getTime() < 2 * 60 * 1000
  );
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function SiteCard({
  site,
  index,
}: {
  site: Site;
  index: number;
}) {
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  return (
    <Card className="relative flex flex-col justify-between w-full group dark:bg-gray-800 dark:border-gray-700">
      {isNew(site) && (
        <div className="bg-green-600 px-3 py-1.5 text-white absolute top-0 left-0 text-xs rounded-br-lg z-10">
          New
        </div>
      )}
      <div className="absolute top-2 right-2 z-10">
        <SiteMenu site={site} />
      </div>
      <CardHeader className="flex flex-col items-center pt-8 pb-2">
        <h1 className="text-5xl text-gray-300 font-black group-hover:text-primary duration-300">
          <span className="text-gray-200 font-light">#</span>
          {index + 1}
        </h1>
        <CardTitle className="mb-1 pt-6 text-xl font-black text-gray-900 dark:text-white text-center">
          {site.name}
        </CardTitle>
        <CardDescription className="text-sm text-gray-500 dark:text-gray-400 text-center">
          {formatDate(site.createdAt)}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col items-center justify-center"></CardContent>
      <CardFooter className="flex gap-2 justify-start pt-0">
        {site.apiKey && (
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => setShowDetailsModal(true)}>
            View details
          </Button>
        )}
        <Link href="/docs/dev/getting-started" target="_blank">
          <Button variant="secondary" size="sm" className="w-full">
            Get started
          </Button>
        </Link>
      </CardFooter>
      {showDetailsModal && (
        <SiteDetailsModal site={site} onOpenChange={setShowDetailsModal} />
      )}
    </Card>
  );
}
