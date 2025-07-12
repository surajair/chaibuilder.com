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
import { kebabCase } from "lodash";
import { Check, Copy, Laptop, Rocket } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

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

const CommandComponent = ({ site }: { site: Site }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(`npx @chaibuilder/create ${kebabCase(site.name)} -key=${site.apiKey}`);
      setCopied(true);
      toast.success('Copied to clipboard', { position: 'top-center' });
      const timeoutId = setTimeout(() => {
        setCopied(false);
      }, 2000);
      return () => clearTimeout(timeoutId);
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  return (
    <div onClick={handleCopy} className="bg-blue-100/40 h-9 w-full overflow-hidden py-1 pl-4 rounded-md flex items-center justify-between">
      <span
        className="font-mono text-sm w-full whitespace-nowrap truncate overflow-hidden text-blue-600"
        style={{ userSelect: "none" }}
      >
        npx @chaibuilder/create {kebabCase(site.name)} -key={'<API_KEY>'}
      </span>
      <button className={`px-3 py-1 mr-2 h-max rounded-full flex items-center text-xs gap-x-1 ${copied ? 'bg-green-200/50 border-green-500 text-green-700' : 'bg-blue-200/90 border-blue-500 text-blue-900 hover:bg-blue-300/70'}`}>
        {copied ? <Check className="h-3 w-3 " /> : <Copy className="h-3 w-3" />}
        <span className={copied ? "" : "w-0 opacity-0 overflow-hidden group-hover:w-auto group-hover:opacity-100 duration-300"}>{copied ? 'Copied' : 'Copy'}</span>
      </button>
    </div>
  );
};

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
          <small className="text-gray-400 font-medium">
            Run this command in your terminal to setup locally
          </small>
          <CommandComponent site={site} />

          <small className="text-gray-400 font-medium">
            OR follow the instructions from our documentation
          </small>
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
