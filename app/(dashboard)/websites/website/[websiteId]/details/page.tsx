"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@chaibuilder/sdk/ui";
import {
  AlertCircle,
  BarChart3,
  CheckCircle,
  Copy,
  ExternalLink,
  Globe,
  Key,
  RotateCcw,
  Settings,
  Trash2,
} from "lucide-react";
import Form from "next/form";
import { useParams } from "next/navigation";
import { useActionState, useState } from "react";
import { addCustomDomain, deleteDomain, deleteWebsite, updateApiKey, updateWebsiteSettings } from "./actions";

export default function WebsiteDetailsPage() {
  const params = useParams();
  const websiteId = params.websiteId as string;

  // General Settings State
  const [websiteName, setWebsiteName] = useState("My Awesome Website");
  const [additionalLanguages, setAdditionalLanguages] = useState<string[]>([]);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");

  // API Key State
  const [apiKey, setApiKey] = useState(`sk_${websiteId}_1234567890abcdef...`);
  const [copied, setCopied] = useState(false);

  // Domain State
  const [customDomain, setCustomDomain] = useState("");
  const [showConfigSteps, setShowConfigSteps] = useState(false);

  // Form Actions
  const [updateState, updateAction, updatePending] = useActionState(
    async (prevState: any, formData: FormData) => {
      const result = await updateWebsiteSettings(formData);
      return result;
    },
    { success: false },
  );

  const [deleteState, deleteAction, deletePending] = useActionState(
    async (prevState: any, formData: FormData) => {
      const result = await deleteWebsite(formData);
      return result;
    },
    { success: false },
  );

  const [apiKeyState, apiKeyAction, apiKeyPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      const result = await updateApiKey(formData);
      if (result.success && result.newApiKey) {
        setApiKey(result.newApiKey);
      }
      return result;
    },
    { success: false },
  );

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

  const [deleteDomainState, deleteDomainAction, deleteDomainPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      const result = await deleteDomain(formData);
      return result;
    },
    { success: false },
  );

  const availableLanguages = [
    { value: "es", label: "Spanish" },
    { value: "fr", label: "French" },
    { value: "de", label: "German" },
    { value: "it", label: "Italian" },
    { value: "pt", label: "Portuguese" },
    { value: "ja", label: "Japanese" },
    { value: "ko", label: "Korean" },
    { value: "zh", label: "Chinese" },
  ];

  const mockDomains = [
    { domain: "www.example.com", status: "active", configured: true },
    { domain: "blog.example.com", status: "pending", configured: false },
  ];

  const handleLanguageToggle = (languageValue: string, checked: boolean) => {
    if (checked && additionalLanguages.length < 2) {
      setAdditionalLanguages([...additionalLanguages, languageValue]);
    } else if (!checked) {
      setAdditionalLanguages(additionalLanguages.filter((lang) => lang !== languageValue));
    }
  };

  const handleCopyKey = async () => {
    await navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ScrollArea className="h-[85vh] px-8 scroll-smooth" style={{ scrollBehavior: "smooth" }}>
      {/* General Settings */}
      <section id="general" className="space-y-4 pt-8">
        <div className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          <h2 className="font-semibold">General Settings</h2>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Website Information</CardTitle>
            <CardDescription>Update your website name and language settings</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={updateAction} className="space-y-4">
              <input type="hidden" name="websiteId" value={websiteId} />
              <div className="space-y-2">
                <Label htmlFor="website-name">Website Name</Label>
                <Input
                  id="website-name"
                  name="websiteName"
                  value={websiteName}
                  onChange={(e) => setWebsiteName(e.target.value)}
                  placeholder="Enter website name"
                />
              </div>

              <div className="space-y-2">
                <Label>Default Language</Label>
                <div className="p-3 bg-muted rounded-lg">
                  <span className="text-sm font-medium">English (en)</span>
                  <p className="text-xs text-muted-foreground mt-1">Default language cannot be changed</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Additional Languages (up to 2)</Label>
                <p className="text-xs text-muted-foreground">Select up to 2 additional languages for your website</p>
                <div className="grid grid-cols-2 gap-3">
                  {availableLanguages.map((language) => (
                    <div key={language.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={language.value}
                        name="additionalLanguages"
                        value={language.value}
                        checked={additionalLanguages.includes(language.value)}
                        onCheckedChange={(checked) => handleLanguageToggle(language.value, checked as boolean)}
                        disabled={!additionalLanguages.includes(language.value) && additionalLanguages.length >= 2}
                      />
                      <Label htmlFor={language.value} className="text-sm">
                        {language.label}
                      </Label>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">Selected: {additionalLanguages.length}/2</p>
              </div>

              <Button type="submit" disabled={updatePending} className="w-full sm:w-auto">
                {updatePending ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </section>

      {/* API Key Settings */}
      <section id="api-key" className="space-y-4 pt-8">
        <div className="flex items-center gap-2">
          <Key className="h-5 w-5" />
          <h2 className=" font-semibold">API Key</h2>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Website API Key</CardTitle>
            <CardDescription>Use this key to authenticate API requests to your website</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>API Key</Label>
              <div className="flex gap-2">
                <Input value={apiKey} readOnly className="font-mono text-sm" />
                <Button variant="outline" size="icon" onClick={handleCopyKey}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">Keep your API key secure and never share it publicly.</p>
            </div>
            <Separator />
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleCopyKey}>
                <Copy className="h-4 w-4 mr-2" />
                {copied ? "Copied!" : "Copy Key"}
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Revoke & Generate New
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Revoke API Key</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will immediately revoke your current API key and generate a new one. Any applications using
                      the current key will stop working until updated.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <Form action={apiKeyAction}>
                      <input type="hidden" name="websiteId" value={websiteId} />
                      <input type="hidden" name="action" value="revoke" />
                      <AlertDialogAction
                        type="submit"
                        disabled={apiKeyPending}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        {apiKeyPending ? "Revoking..." : "Revoke & Generate New"}
                      </AlertDialogAction>
                    </Form>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Domain Settings */}
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
              <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <span className="font-mono">{websiteId}.webbuilder.app</span>
                <Button variant="ghost" size="sm">
                  <ExternalLink className="h-4 w-4" />
                </Button>
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
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Domain</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to remove &lsquo;{domainItem.domain}&rsquo; from this website? This
                              action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <form action={deleteDomainAction}>
                              <input type="hidden" name="websiteId" value={websiteId} />
                              <input type="hidden" name="domain" value={domainItem.domain} />
                              <AlertDialogAction
                                type="submit"
                                disabled={deleteDomainPending}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                {deleteDomainPending ? "Deleting..." : "Delete Domain"}
                              </AlertDialogAction>
                            </form>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Usage Analytics */}
      <section id="usage" className="space-y-4 pt-8">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          <h2 className=" font-semibold">Usage Analytics</h2>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Assets Storage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2.4 GB</div>
                <div className="w-full bg-muted rounded-full h-2 mt-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: "48%" }}></div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">48% of 5 GB limit</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">AI Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,247</div>
                <div className="w-full bg-muted rounded-full h-2 mt-2">
                  <div className="bg-secondary h-2 rounded-full" style={{ width: "62%" }}></div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">62% of 2,000 monthly limit</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Page Views</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">15.2K</div>
                <div className="text-xs text-muted-foreground mt-1">This month</div>
                <div className="text-xs text-green-600 mt-1">+12% from last month</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Usage Details</CardTitle>
              <CardDescription>Detailed breakdown of your resource consumption</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Images & Media</span>
                  <span className="text-sm font-medium">1.8 GB</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Code & Assets</span>
                  <span className="text-sm font-medium">0.6 GB</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">AI Content Generation</span>
                  <span className="text-sm font-medium">847 requests</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">AI Image Generation</span>
                  <span className="text-sm font-medium">400 requests</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Danger Zone */}
      <section className="pt-8">
        <Card className="border-destructive/20">
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
            <CardDescription>Permanently delete this website and all of its data</CardDescription>
          </CardHeader>
          <CardContent>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Delete Website</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your website and remove all data from our
                    servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <form action={deleteAction}>
                  <input type="hidden" name="websiteId" value={websiteId} />
                  <div className="space-y-2">
                    <Label htmlFor="delete-confirm">Type &lsquo;DELETE&lsquo; to confirm</Label>
                    <Input
                      id="delete-confirm"
                      value={deleteConfirmation}
                      onChange={(e) => setDeleteConfirmation(e.target.value)}
                      placeholder="DELETE"
                    />
                  </div>
                  <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setDeleteConfirmation("")}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      type="submit"
                      disabled={deleteConfirmation !== "DELETE" || deletePending}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                      {deletePending ? "Deleting..." : "Delete Website"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </form>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </section>
    </ScrollArea>
  );
}
