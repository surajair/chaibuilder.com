"use client";
import { SiteMenu, SiteModals } from "@/components/dashboard/site-menu";
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
import { Laptop, Rocket } from "lucide-react";

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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  return (
    <>
      <Card
        onClick={(e) => {
          setShowDetailsModal(true);
        }}
        className="relative flex flex-col justify-between w-full group dark:bg-gray-800 dark:border-gray-700 overflow-hidden hover:border-gray-300 cursor-pointer"
      >
        {isNew(site) && (
          <div className="bg-green-600 px-3 py-1.5 text-white absolute top-0 left-0 text-xs rounded-br-lg z-10">
            New
          </div>
        )}
        <div className="absolute top-2 right-2 z-10">
          <SiteMenu
            site={site}
            showDetailsModal={showDetailsModal}
            setShowDetailsModal={setShowDetailsModal}
            showDeleteConfirm={showDeleteConfirm}
            setShowDeleteConfirm={setShowDeleteConfirm}
          />
        </div>
        <CardHeader className="flex flex-col items-center pt-8 pb-2">
          <h1 className="text-5xl text-gray-300 font-black group-hover:text-fuchsia-500 duration-300">
            <span className="text-gray-200 font-light">#</span>
            {index + 1}
          </h1>
          <CardTitle className="mb-1 pt-6 text-xl font-black text-gray-900 dark:text-white text-center">
            {site.name}
          </CardTitle>
          <CardDescription className="text-xs text-gray-500 dark:text-gray-400 text-center">
            {formatDate(site.createdAt)}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col items-center justify-center p-2"></CardContent>
        <CardFooter className="flex flex-col gap-2 justify-start pt-0 scale-95">
          <div className="flex gap-2 w-full">
            {site.apiKey && (
              <Button variant="outline" size="sm" className="w-full">
                View details
              </Button>
            )}
          </div>
          <div className="flex gap-2 w-full">
            <Link
              href="/docs/developers/getting-started/setup-locally"
              target="_blank"
              className="w-full"
            >
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => e.stopPropagation()}
                className="w-full bg-purple-300/10 hover:bg-purple-300/20 duration-300"
              >
                <Laptop className="mr-2 h-4 w-4" />
                Setup locally
              </Button>
            </Link>
            <Link
              href="/docs/developers/getting-started/deploy-to-vercel"
              target="_blank"
              className="w-full"
            >
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => e.stopPropagation()}
                className="w-full bg-blue-300/10 hover:bg-blue-300/20 duration-300"
              >
                <Rocket className="mr-2 h-4 w-4" />
                Deploy to Vercel
              </Button>
            </Link>
          </div>
        </CardFooter>
      </Card>
      <SiteModals
        site={site}
        showDetailsModal={showDetailsModal}
        setShowDetailsModal={setShowDetailsModal}
        showDeleteConfirm={showDeleteConfirm}
        setShowDeleteConfirm={setShowDeleteConfirm}
      />
    </>
  );
}
