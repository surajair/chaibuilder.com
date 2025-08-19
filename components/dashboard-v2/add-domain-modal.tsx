"use client";

import { addDomain, verifyDomain } from "@/actions/add-domain-action";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Site } from "@/utils/types";
import { AlertCircle, CheckCircle, ExternalLink, Globe, Loader, RefreshCw } from "lucide-react";
import { useActionState, useMemo, useState } from "react";
import { toast } from "sonner";

interface AddDomainModalProps {
  websiteId: string;
  siteData: Site;
}

function AddDomainModal({ websiteId, siteData }: AddDomainModalProps) {
  const [customDomain, setCustomDomain] = useState("");
  const [verifyingDomains, setVerifyingDomains] = useState<Set<string>>(new Set());
  const [expandedDomain, setExpandedDomain] = useState<string | null>(null);

  const defaultDomain = useMemo(() => {
    // Show domain if available and configured, otherwise show subdomain
    if (siteData.domain && siteData.domainConfigured) {
      return siteData.domain;
    }
    return siteData.subdomain;
  }, [siteData]);

  const [addDomainState, addDomainAction, addDomainPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      const domain = formData.get("customDomain") as string;
      if (!domain) {
        toast.error("Domain is required");
        return { success: false, error: "Domain is required" };
      }

      const result = await addDomain(siteData, domain);
      if (result.success) {
        setCustomDomain("");
        if (result.configured) {
          toast.success("Domain added and configured successfully!");
        } else {
          toast.success("Domain added! Please configure DNS settings to complete setup.");
        }
      } else {
        toast.error(result.error || "Failed to add domain");
      }
      return result;
    },
    { success: false, error: "" },
  );

  const handleVerifyDomain = async (domain: string) => {
    setVerifyingDomains((prev) => new Set(prev).add(domain));

    try {
      const result = await verifyDomain(domain);
      if (result.success) {
        if (result.configured) {
          toast.success("Domain is now configured!");
          // Trigger a page refresh to update the domain status
          window.location.reload();
        } else {
          toast.info("Domain is still not configured.");
        }
      } else {
        toast.error(result.error || "Failed to verify domain");
      }
    } catch (error) {
      toast.error("Failed to verify domain");
    } finally {
      setVerifyingDomains((prev) => {
        const newSet = new Set(prev);
        newSet.delete(domain);
        return newSet;
      });
    }
  };

  if (!defaultDomain) return null;

  return (
    <section id="domain" className="space-y-4 pt-8">
      <div className="flex items-center gap-2">
        <Globe className="h-5 w-5" />
        <h2 className=" font-semibold">Domain Settings</h2>
      </div>

      <div className="space-y-4">
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle>Default Domain</CardTitle>
            <CardDescription>Your website&lsquo;s default domain provided by our platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 py-2 px-4 bg-muted rounded-lg">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <a
                className="flex items-center gap-x-2 hover:text-blue-500 transition-colors"
                href={`https://${defaultDomain}`}
                target="_blank"
                rel="noopener noreferrer">
                <span>{defaultDomain}</span> <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-none">
          <CardHeader>
            <CardTitle>Custom Domain</CardTitle>
            <CardDescription>Connect your own domain to this website</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form action={addDomainAction} className="space-y-2">
              <input type="hidden" name="websiteId" value={websiteId} />
              <Label htmlFor="custom-domain">Domain Name</Label>
              <div className="flex gap-2">
                <Input
                  id="custom-domain"
                  name="customDomain"
                  value={customDomain}
                  onChange={(e) => setCustomDomain(e.target.value)}
                  placeholder="example.com"
                  className="font-mono"
                />
                <Button type="submit" disabled={addDomainPending}>
                  {addDomainPending ? "Adding..." : "Add Domain"}
                </Button>
              </div>
            </form>

            <div className="space-y-3">
              {/* Default Subdomain */}
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>{siteData.subdomain}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Default Domain</Badge>
                </div>
              </div>

              {/* Custom Domain */}
              {siteData.domain && (
                <div className="space-y-3">
                  <div className="p-3 space-y-2 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <div className="w-full flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {siteData.domainConfigured ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-yellow-500" />
                        )}
                        <span>{siteData.domain}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={siteData.domainConfigured ? "outline" : "secondary"}>
                          {siteData.domainConfigured ? "Configured" : "Not Configured"}
                        </Badge>
                        {!siteData.domainConfigured && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleVerifyDomain(siteData.domain!);
                            }}
                            disabled={verifyingDomains.has(siteData.domain!)}>
                            {verifyingDomains.has(siteData.domain!) ? (
                              <>
                                <Loader className="mr-1 h-3 w-3 animate-spin" />
                                Checking...
                              </>
                            ) : (
                              <>
                                <RefreshCw className="mr-1 h-3 w-3" />
                                Refresh
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                    {!siteData.domainConfigured && (
                      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                          <div className="space-y-2">
                            <p className="text-sm text-yellow-800 font-medium">Domain Configuration Required</p>
                            <p className="text-sm text-yellow-700">
                              To configure your domain, add the required DNS records at your domain provider.
                            </p>
                            <a
                              href="https://vercel.com/docs/domains/working-with-domains/add-a-domain"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 underline">
                              View configuration guide
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

AddDomainModal.displayName = "AddDomainModal";

export default AddDomainModal;
