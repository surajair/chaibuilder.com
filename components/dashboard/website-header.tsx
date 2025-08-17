"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface WebsiteHeaderProps {
  websiteId: string;
  projectName: string;
}

const getCurrentPageName = (pathname: string) => {
  if (pathname.includes("/submissions")) return "Submissions";
  if (pathname.includes("/blogs/new")) return "New Blog";
  if (pathname.includes("/blogs") && pathname.includes("/edit")) return "Edit Blog";
  if (pathname.includes("/blogs")) return "Blogs";
  if (pathname.includes("/settings")) return "Settings";
  return "Dashboard";
};

const getSubdomain = (name: string) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
};

export function WebsiteHeader({ websiteId, projectName }: WebsiteHeaderProps) {
  const pathname = usePathname();

  return (
    <div className="border-b bg-card">
      <div className="flex items-center justify-between pb-4">
        <div className="flex items-center gap-4">
          <Link href="/websites">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              All Projects
            </Button>
          </Link>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/websites" className="hover:text-foreground transition-colors">
              Websites
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href={`/websites/website/${websiteId}`} className="hover:text-foreground transition-colors">
              {projectName}
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground font-medium">{getCurrentPageName(pathname)}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-sm font-medium">{projectName}</div>
            {/* <div className="text-xs text-muted-foreground">{getSubdomain(projectName)}.chaibuilder.app</div> */}
          </div>
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
