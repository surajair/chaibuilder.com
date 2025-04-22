import { getSites } from "@/actions/get-sites-actions";
import { getUser } from "@/actions/get-user-action";
import { Logo } from "@/components/builder/logo";
import { CreateSite } from "@/components/dashboard/create-site";
import SiteCard from "@/components/dashboard/site-card";
import { UserProfile } from "@/components/dashboard/user-profile";
import { Site } from "@/utils/types";

export default async function ChaibuilderWebsites() {
  const user = await getUser();
  const data = await getSites(user.id);
  const sites: Site[] = data as Site[];

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <header className="border-b bg-white">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Logo shouldRedirect={false} />
            <span className="ml-2 text-xl font-bold tracking-wide uppercase">
              Chai Builder
            </span>
          </div>
          <UserProfile user={user} />
        </div>
      </header>

      <main className="container flex-1 py-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-xl sm:text-3xl font-bold">Your Websites</h1>
          <CreateSite isSiteLimitReached={sites.length > 1} />
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
