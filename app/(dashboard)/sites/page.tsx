import { Logo } from "@/components/builder/logo";
import { CreateSite } from "@/components/dashboard/create-site";
import { UserProfile } from "@/components/dashboard/user-profile";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SiteMenu } from "@/components/dashboard/site-menu";
import { User } from "@supabase/supabase-js";

// Check if site was created in the last 2 minutes
const isNew = (site: any) =>
  new Date().getTime() - new Date(site.createdAt).getTime() < 2 * 60 * 1000;

// Format the creation date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const SITES = [
  { name: "Site 1", id: "1", createdAt: new Date() },
  { name: "Site 1", id: "1", createdAt: new Date() },
];

export default function ChaibuilderWebsites() {
  const sites: any[] = SITES;

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <header className="border-b bg-white">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <Logo />
              <span className="text-xl font-bold">CHAI BUILDER</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <UserProfile />
          </div>
        </div>
      </header>

      <div className="container flex-1 flex items-center justify-center">
        Coming soon...
      </div>

      <main className="hidden container flex-1 py-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Your Sites</h1>
          <CreateSite isSiteLimitReached={false} />
        </div>

        {sites.length === 0 ? (
          <div className="flex h-[calc(100vh-200px)] flex-col items-center justify-center">
            <div className="mb-8 text-center">
              <h2 className="mb-2 text-2xl font-semibold">No sites yet</h2>
              <p className="mb-6 text-muted-foreground">
                Create your first site to get started with Chai Builder
              </p>
              <div className="flex flex-col gap-4">
                <CreateSite isSiteLimitReached={false} />
              </div>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sites.map((site) => {
              return (
                <Card
                  key={site.id}
                  className="group overflow-hidden transition-all hover:shadow-md"
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xl font-bold">
                      {site.name}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      {isNew(site) && (
                        <Badge
                          variant="default"
                          className="bg-green-500 text-white"
                        >
                          New
                        </Badge>
                      )}
                      <SiteMenu site={site} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground">
                      <p>Created: {formatDate(site.createdAt)}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
