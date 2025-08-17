"use client";

import { createSite } from "@/actions/create-site-action";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Globe, Plus, Star, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const availableLanguages = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "it", name: "Italian" },
  { code: "pt", name: "Portuguese" },
  { code: "nl", name: "Dutch" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "zh", name: "Chinese" },
];

export default function NewWebsitePage() {
  const router = useRouter();
  const [websiteName, setWebsiteName] = useState("");
  const [subdomain, setSubdomain] = useState("");
  const [defaultLanguage, setDefaultLanguage] = useState("en");
  const [additionalLanguages, setAdditionalLanguages] = useState<string[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  // Generate subdomain from website name
  const generateSubdomain = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  };

  const handleWebsiteNameChange = (value: string) => {
    setWebsiteName(value);
    setSubdomain(generateSubdomain(value));
  };

  const handleAddLanguage = (languageCode: string) => {
    if (
      additionalLanguages.length < 2 &&
      !additionalLanguages.includes(languageCode) &&
      languageCode !== defaultLanguage
    ) {
      setAdditionalLanguages([...additionalLanguages, languageCode]);
    }
  };

  const handleRemoveLanguage = (languageCode: string) => {
    setAdditionalLanguages(additionalLanguages.filter((lang) => lang !== languageCode));
  };

  const handleCreateWebsite = async () => {
    if (!websiteName.trim()) return;

    setIsCreating(true);

    try {
      const formData = {
        name: websiteName,
        fallbackLang: defaultLanguage,
        languages: additionalLanguages,
      };

      const result = await createSite(formData);

      if (result.success && result.data) {
        toast.success("Website created successfully!");
        router.push(`/websites/website/${result.data.id}`);
      } else {
        toast.error(result.error || "Failed to create website");
        setIsCreating(false);
      }
    } catch (error) {
      toast.error("An error occurred while creating the website");
      setIsCreating(false);
    }
  };

  const getLanguageName = (code: string) => {
    return availableLanguages.find((lang) => lang.code === code)?.name || code;
  };

  const availableToAdd = availableLanguages.filter(
    (lang) => lang.code !== defaultLanguage && !additionalLanguages.includes(lang.code),
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto">
        <div className="gap-4 mb-8">
          <Link href="/websites">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to websites
            </Button>
          </Link>
          <div className="pt-2">
            <h1 className="text-3xl font-playfair font-bold">Add New Website</h1>
            <p className="text-muted-foreground mt-1 text-sm">Create a new website project</p>
          </div>
        </div>

        <Card className="border-0 p-0">
          <CardContent className="space-y-6 p-0">
            {/* Website Name */}
            <div className="space-y-2">
              <Label htmlFor="websiteName">Website Name</Label>
              <Input
                id="websiteName"
                value={websiteName}
                onChange={(e) => handleWebsiteNameChange(e.target.value)}
                placeholder="My Awesome Website"
              />
            </div>

            {/* Subdomain Preview */}
            <div className="space-y-2">
              <Label>Subdomain</Label>
              <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <span className="font-mono text-sm">{subdomain || "your-website-name"}.chaibuilder.app</span>
              </div>
              <p className="text-xs text-muted-foreground">This subdomain cannot be changed after creation</p>
            </div>

            {/* Default Language */}
            <div className="space-y-2">
              <Label>Default Language</Label>
              <Select value={defaultLanguage} onValueChange={setDefaultLanguage}>
                <SelectTrigger className="h-11 focus-visible:ring-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableLanguages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      <div className="flex items-center gap-2">
                        <span className="font-mono">{lang.code}</span>
                        <span>{lang.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Additional Languages */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Additional Languages (Optional)</Label>
                <span className="text-xs text-muted-foreground">{additionalLanguages.length}/2 selected</span>
              </div>

              {/* Selected Languages */}
              {additionalLanguages.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {additionalLanguages.map((langCode) => (
                    <Badge key={langCode} variant="secondary" className="flex items-center gap-2">
                      <span className="font-mono">{langCode}</span>
                      <span>{getLanguageName(langCode)}</span>
                      <X
                        className="h-3 w-3 cursor-pointer hover:text-destructive"
                        onClick={() => handleRemoveLanguage(langCode)}
                      />
                    </Badge>
                  ))}
                </div>
              )}

              {/* Add Language Dropdown */}
              {additionalLanguages.length < 2 && (
                <Select
                  value={additionalLanguages.length > 0 ? additionalLanguages[additionalLanguages.length - 1] : ""}
                  onValueChange={handleAddLanguage}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Add another language" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableToAdd.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        <div className="flex items-center gap-2">
                          <span className="font-mono">{lang.code}</span>
                          <span>{lang.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* Language Summary */}
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">Language Configuration</h4>
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-mono">{defaultLanguage}</span>
                  <span>{getLanguageName(defaultLanguage)}</span>
                  <Badge variant="outline" className="text-xs border-border text-[12px] py-px">
                    <Star className="h-3 w-3 mr-1 text-yellow-500 fill-yellow-500" />
                    Default
                  </Badge>
                </div>
                {additionalLanguages.map((langCode) => (
                  <div key={langCode} className="flex items-center gap-2">
                    <span className="font-mono">{langCode}</span>
                    <span>{getLanguageName(langCode)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Create Button */}
            <div className="flex gap-3 pt-4">
              <Button onClick={handleCreateWebsite} disabled={!websiteName.trim() || isCreating} className="flex-1">
                {isCreating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating Website...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Website
                  </>
                )}
              </Button>
              <Link href="/">
                <Button variant="outline" disabled={isCreating}>
                  Cancel
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
