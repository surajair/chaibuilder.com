"use client";

import { addDomain } from "@/actions/add-domain-action";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Site } from "@/utils/types";
import { AlertCircle, CheckCircle, ExternalLink, Globe } from "lucide-react";
import { useActionState, useMemo, useState } from "react";
import { toast } from "sonner";

interface AddDomainModalProps {
  websiteId: string;
  siteData: Site & {
    app_api_keys: { apiKey: any }[];
    app_domains: { domain: string; subdomain: string; hosting: string; domainConfigured: boolean }[];
  };
}

function AddDomainModal({ websiteId, siteData }: AddDomainModalProps) {
  const [customDomain, setCustomDomain] = useState("");

  const domains = useMemo(() => siteData?.app_domains || [], [siteData]);

  const defaultDomain = useMemo(() => {
    let defaultDomain = domains.find((domain) => domain.domain && domain?.domainConfigured)?.domain;
    if (!defaultDomain) {
      defaultDomain = domains.find((domain) => domain.subdomain)?.subdomain;
    }
    return defaultDomain;
  }, [domains]);

  const [, addDomainAction, addDomainPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      const domain = formData.get("customDomain") as string;
      if (!domain) {
        toast.error("Domain is required");
        return { success: false, error: "Domain is required" };
      }

      const result = await addDomain(siteData, domain);
      if (result.success) {
        setCustomDomain("");
        toast.success("Domain added successfully!");
      } else {
        toast.error(result.error || "Failed to add domain");
      }
      return result;
    },
    { success: false, error: "" },
  );

  if (domains?.length === 0 || !defaultDomain) return null;

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
              {domains?.map((domainItem, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    {domainItem.domainConfigured ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-yellow-500" />
                    )}
                    <span>{domainItem.subdomain || domainItem.domain}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={domainItem.domainConfigured ? "outline" : "secondary"}>
                      {domainItem.domainConfigured ? "Configured" : "Not Configured"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

AddDomainModal.displayName = "AddDomainModal";

export default AddDomainModal;
