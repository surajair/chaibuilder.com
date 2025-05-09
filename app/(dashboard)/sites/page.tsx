import { getSites } from "@/actions/get-sites-actions";
import { getUser } from "@/actions/get-user-action";
import { CreateSite } from "@/components/dashboard/create-site";
import SiteCard from "@/components/dashboard/site-card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Site } from "@/utils/types";
import Link from "next/link";

export default async function ChaibuilderWebsites() {
  const user = await getUser();
  const data = await getSites(user.id);
  const sites: Site[] = data as Site[];

  return (
    <div className="flex min-h-screen flex-col ">
      {!user?.user_metadata?.hasPassword && (
        <div className="">
          <Alert variant="default">
            <AlertTitle className="text-lg font-semibold">
              Please set your password
            </AlertTitle>
            <AlertDescription className="flex flex-col gap-2">
              <p>
                Please set a your password to get started with Chai Builder.
                This will allow you to access visual builder on your site
              </p>
              <Link href="/update-password">
                <Button size="sm" variant="default">
                  Set password
                </Button>
              </Link>
            </AlertDescription>
          </Alert>
        </div>
      )}
      <main className="container flex-1 py-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-xl sm:text-3xl font-bold">Your Websites</h1>
          <CreateSite isSiteLimitReached={sites.length >= 2} />
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
          <div className="grid gap-6 w-full sm:grid-cols-2 lg:grid-cols-3 overflow-y-auto">
            {sites.map((site, index) => (
              <SiteCard key={site.id} site={site} index={index} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
