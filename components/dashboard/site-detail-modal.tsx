"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Separator,
} from "@chaibuilder/sdk/ui";
import { CopyIcon, Eye, EyeOff } from "lucide-react";
import { ConfirmDialog } from "./confirm-dialog";
import { Site } from "@/utils/types";
import { toast } from "sonner";
import { updateSite } from "@/actions/update-site-action";
import { revokeApiKey } from "@/actions/revoke-api-action";
import { find } from "lodash";
import Loader from "./loader";

interface SiteDetailsModalProps {
  site: Site;
  onOpenChange: (open: boolean) => void;
}

const AVAILABLE_LANGUAGES = [
  { name: "English", code: "en" },
  { name: "Spanish", code: "es" },
  { name: "French", code: "fr" },
  { name: "Portuguese", code: "pt" },
  { name: "Russian", code: "ru" },
  { name: "Japanese", code: "ja" },
];

export function SiteDetailsModal({
  site,
  onOpenChange,
}: SiteDetailsModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [showRevokeConfirm, setShowRevokeConfirm] = useState(false);
  const [formData, setFormData] = useState({
    name: site.name,
    languages: site.languages,
  });

  const handleSave = async () => {
    try {
      setIsSaving(true);

      await updateSite(site.id, formData);
      onOpenChange(false);
      toast.success("Website details updated successfully.");
    } catch (error) {
      toast.error("Failed to updated website data.");
    }
    setIsEditing(false);
    setIsSaving(false);
  };

  const handleRevokeApiKey = async () => {
    try {
      await revokeApiKey(site);
      toast.success("Website API key revoked successfully.");
    } catch (error) {
      toast.error("Failed to revoke website API key.");
    }

    setShowRevokeConfirm(false);
  };

  const toggleLanguage = (lang: string) => {
    if (formData.languages.includes(lang)) {
      setFormData({
        ...formData,
        languages: formData.languages.filter((l) => l !== lang),
      });
    } else {
      setFormData({
        ...formData,
        languages: [...formData.languages, lang],
      });
    }
  };

  return (
    <>
      <Dialog open={true} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Site Details</DialogTitle>
            <DialogDescription>
              View and manage your site details.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="api-key">API Key</Label>
              <div className="flex items-center space-x-2">
                <div className="relative flex-1">
                  <Input
                    id="api-key"
                    value={site.apiKey}
                    type={showApiKey ? "text" : "password"}
                    readOnly
                    className="pr-9 h-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowApiKey(!showApiKey)}
                  >
                    {showApiKey ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                    <span className="sr-only">
                      {showApiKey ? "Hide API key" : "Show API key"}
                    </span>
                  </Button>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    navigator.clipboard.writeText(site.apiKey);
                    toast.success("API key copied");
                  }}
                >
                  <CopyIcon className="h-4 w-4" />
                  <span className="sr-only">Copy API key</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowRevokeConfirm(true)}
                >
                  Revoke
                </Button>
              </div>
            </div>

            <Separator />

            <div className="space-y-1">
              <Label htmlFor="name">Site Name</Label>
              <Input
                id="name"
                type="text"
                size={60}
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                readOnly={!isEditing || isSaving}
                placeholder="Enter website name"
                required
                className={`focus-visible:ring-0 border-0 focus-visible:ring-transparent rounded-none px-0 !text-2xl text-purple-800 font-bold ${isEditing ? "border-b" : ""}`}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fallback-lang">Fallback Language</Label>
              <Input
                id="fallback-lang"
                value={
                  find(AVAILABLE_LANGUAGES, { code: site.fallbackLang })
                    ?.name || ""
                }
                readOnly
                disabled
              />
              <p className="text-xs text-muted-foreground">
                The fallback language cannot be changed after site creation.
              </p>
            </div>

            <div className="space-y-2">
              <Label>Languages</Label>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_LANGUAGES.map((lang) => {
                  const isSelected = formData.languages.includes(lang.code);
                  return (
                    <Button
                      key={lang.code}
                      variant={isSelected ? "default" : "outline"}
                      size="sm"
                      onClick={() => isEditing && toggleLanguage(lang.code)}
                      disabled={
                        !isEditing ||
                        isSaving ||
                        lang.code === site.fallbackLang ||
                        (lang.code !== site.fallbackLang &&
                          !formData.languages.includes(lang.code) &&
                          !isEditing)
                      }
                      className={`h-8 text-xs ${isSelected ? "bg-gray-700 hover:bg-gray-700" : "hover:bg-gray-100 duration-300"}`}
                    >
                      {lang.name}
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>

          <DialogFooter>
            {isEditing ? (
              <>
                <Button
                  variant="outline"
                  disabled={isSaving}
                  onClick={() => {
                    setFormData({
                      name: site.name,
                      languages: site.languages,
                    });
                    setIsEditing(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-gray-900 hover:bg-gray-700 flex items-center gap-x-1.5 min-w-24"
                >
                  {isSaving ? (
                    <>
                      <Loader fullscreen={false} />
                    </>
                  ) : (
                    <>Save Changes</>
                  )}
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Close
                </Button>
                <Button
                  onClick={() => setIsEditing(true)}
                  className="bg-gray-900 hover:bg-gray-700 w-24"
                >
                  Edit
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={showRevokeConfirm}
        onOpenChange={setShowRevokeConfirm}
        title="Revoke API Key"
        description="Are you sure you want to revoke this API key? This action cannot be undone and will invalidate any existing integrations using this key."
        onConfirm={handleRevokeApiKey}
      />
    </>
  );
}
