import { getSite } from "@/actions/get-site-action";
import { getUser } from "@/actions/get-user-action";
import { WebsiteHeader } from "@/components/dashboard/website-header";
import { WebsiteNavigation } from "@/components/dashboard/website-navigation";
import type React from "react";

interface ProjectLayoutProps {
  children: React.ReactNode;
  params: {
    websiteId: string;
  };
}

export default async function ProjectLayout({ children, params }: ProjectLayoutProps) {
  const { websiteId } = params;

  try {
    const user = await getUser();
    const siteData = await getSite(user.id, websiteId);

    return (
      <div className="bg-background h-full">
        <WebsiteHeader websiteId={websiteId} projectName={siteData.name} />
        <WebsiteNavigation websiteId={websiteId} />

        {/* Main Content */}
        <div className="h-full">{children}</div>
      </div>
    );
  } catch (error) {
    // Fallback UI in case of error
    return (
      <div className="bg-background">
        <div className="p-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-destructive">Error Loading Website</h1>
            <p className="text-muted-foreground mt-2">Unable to load website data. Please try again later.</p>
          </div>
        </div>
      </div>
    );
  }
}
