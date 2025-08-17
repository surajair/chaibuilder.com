"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { kebabCase } from "lodash";
import { AlertCircle, CheckCircle, ExternalLink, Globe } from "lucide-react";
import { useActionState, useState } from "react";

const addCustomDomain = (formData: FormData) => {
  return { success: true, domain: formData.get("customDomain") };
};

interface AddDomainModalProps {
  websiteId: string;
  siteData: {
    id: any;
    name: any;
    createdAt: any;
    fallbackLang: any;
    languages: any;
    app_api_keys: { apiKey: any }[];
  };
}

function AddDomainModal({ websiteId, siteData }: AddDomainModalProps) {
  const [customDomain, setCustomDomain] = useState("");

  const [addDomainState, addDomainAction, addDomainPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      const result = await addCustomDomain(formData);
      if (result.success) {
        setCustomDomain("");
      }
      return result;
    },
    { success: false, domain: "" },
  );

  const mockDomains = [
    { domain: "www.example.com", status: "active", configured: true },
    { domain: "blog.example.com", status: "pending", configured: false },
  ];

  return (
    <section id="domain" className="space-y-4 pt-8">
      <div className="flex items-center gap-2">
        <Globe className="h-5 w-5" />
        <h2 className=" font-semibold">Domain Settings</h2>
      </div>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Default Domain</CardTitle>
            <CardDescription>Your website&lsquo;s default domain provided by our platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 py-2 px-4 bg-muted rounded-lg">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <a
                className="flex items-center gap-x-2 hover:text-blue-500 transition-colors"
                href={`https://${kebabCase(siteData.name)}.chaibuilder.app`}
                target="_blank"
                rel="noopener noreferrer">
                <span className="font-mono">{kebabCase(siteData.name)}.chaibuilder.app</span>{" "}
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </CardContent>
        </Card>

        <Card>
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
              {mockDomains.map((domainItem, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    {domainItem.status === "active" ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-yellow-500" />
                    )}
                    <span className="font-mono">{domainItem.domain}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={domainItem.status === "active" ? "outline" : "secondary"}>
                      {domainItem.status}
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
