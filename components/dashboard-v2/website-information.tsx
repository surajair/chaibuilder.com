"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings } from "lucide-react";
import { useState, useActionState } from "react";
import { updateWebsiteSettings } from "@/app/(dashboard)/websites/website/[websiteId]/details/actions";

interface WebsiteInformationProps {
  websiteId: string;
  siteData: {
    id: any;
    name: any;
    createdAt: any;
    fallbackLang: any;
    languages: any;
    app_api_keys: { apiKey: any; }[];
  };
  initialWebsiteName?: string;
  initialAdditionalLanguages?: string[];
}

function WebsiteInformation({ 
  websiteId,
  siteData,
  initialWebsiteName,
  initialAdditionalLanguages
}: WebsiteInformationProps) {
  const [websiteName, setWebsiteName] = useState(initialWebsiteName || siteData.name || "My Awesome Website");
  const [additionalLanguages, setAdditionalLanguages] = useState<string[]>(initialAdditionalLanguages || siteData.languages || []);

  const [updateState, updateAction, updatePending] = useActionState(
    async (prevState: any, formData: FormData) => {
      const result = await updateWebsiteSettings(formData);
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

  const handleLanguageToggle = (languageValue: string, checked: boolean) => {
    if (checked && additionalLanguages.length < 2) {
      setAdditionalLanguages([...additionalLanguages, languageValue]);
    } else if (!checked) {
      setAdditionalLanguages(additionalLanguages.filter((lang) => lang !== languageValue));
    }
  };

  return (
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
              <div className="grid grid-cols-3 gap-3">
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
  );
}

WebsiteInformation.displayName = "WebsiteInformation";

export default WebsiteInformation;
