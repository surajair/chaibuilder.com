import { Logo } from "@/components/builder/logo";
import { CreateSite } from "@/components/dashboard/create-site";
import { UserProfile } from "@/components/dashboard/user-profile";
import { SiteMenu } from "@/components/dashboard/site-menu";
import { getSites } from "@/actions/get-sites-actions";
import { getUser } from "@/actions/get-user-action";
import { Site } from "@/utils/types";

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
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 overflow-y-auto">
            {sites.map((site, index) => {
              return (
                <div
                  key={site.id}
                  className="overflow-hidden relative w-full sm:max-w-sm border border-gray-200 hover:border-gray-400 duration-300 rounded-lg group dark:bg-gray-800 dark:border-gray-700 p-8 bg-white"
                >
                  {isNew(site) && (
                    <div className="bg-green-600 px-3 py-1.5 text-white absolute top-0 left-0 text-xs rounded-br-lg">
                      New
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <SiteMenu site={site} />
                  </div>
                  <div className="flex flex-col items-center">
                    <h1 className="text-5xl text-gray-300 font-black group-hover:text-primary duration-300">
                      <span className="text-gray-200 font-light">#</span>
                      {index + 1}
                    </h1>
                    <h5 className="mb-1 pt-8 text-xl font-black text-gray-900 dark:text-white font-bold">
                      {site.name}
                    </h5>
                    <span className="text-sm text-gray-500 dark:text-gray-400 text-sm">
                      {formatDate(site.createdAt)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
