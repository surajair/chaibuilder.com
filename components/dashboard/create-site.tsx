"use client";

import "@/public/chaistyles.css";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// } from "@/components/ui/select";
import { Button } from "../ui/button";
import { useState } from "react";
import { Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@chaibuilder/sdk/ui";

const MAX_SITES = 2;

interface CreateSiteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateSite: (site: Omit<any, "id" | "apiKey">) => void;
  isCreating: boolean;
}

const AVAILABLE_LANGUAGES = [
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "it", label: "Italian" },
  { value: "pt", label: "Portuguese" },
  { value: "ru", label: "Russian" },
  { value: "zh", label: "Chinese" },
  { value: "ja", label: "Japanese" },
  { value: "ko", label: "Korean" },
];

function CreateSiteModal({
  open,
  onOpenChange,
  onCreateSite,
  isCreating,
}: CreateSiteModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    fallbackLang: "",
    languages: [] as string[],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateSite({
      name: formData.name,
      fallbackLang: formData.fallbackLang,
      languages: formData.languages,
      createdAt: new Date().toISOString(),
    });
    setFormData({
      name: "",
      fallbackLang: "",
      languages: [],
    });
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] z-[9999]">
        <DialogHeader>
          <DialogTitle>Create New Site</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new site.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Site Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="My Awesome Site"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fallback-lang">Default Language</Label>
              <Select
                value={formData.fallbackLang}
                onValueChange={(value) =>
                  setFormData({ ...formData, fallbackLang: value })
                }
                required
              >
                <SelectTrigger id="fallback-lang">
                  <SelectValue placeholder="Select a language" />
                </SelectTrigger>
                <SelectContent>
                  {AVAILABLE_LANGUAGES.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Note: Once set, the default language cannot be changed.
              </p>
            </div>

            <div className="space-y-2">
              <Label>Additional Languages</Label>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_LANGUAGES.map((lang) => (
                  <Button
                    key={lang.value}
                    type="button"
                    variant={
                      formData.languages.includes(lang.value)
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    onClick={() => toggleLanguage(lang.value)}
                    disabled={lang.value === formData.fallbackLang}
                    className="h-8"
                  >
                    {lang.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isCreating || !formData.name || !formData.fallbackLang}
            >
              {isCreating ? "Creating..." : "Create Site"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function CreateSite({
  isSiteLimitReached,
}: {
  isSiteLimitReached: boolean;
}) {
  const [isCreatingSite, setIsCreatingSite] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Create a new site
  const handleCreateSite = async (siteData: Omit<any, "id" | "apiKey">) => {
    if (isSiteLimitReached) return;

    setIsCreatingSite(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const newSite: any = {
      ...siteData,
      id: Math.random().toString(36).substring(2, 9),
    };

    setIsCreatingSite(false);
    setShowCreateModal(false);
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="default"
              onClick={() => !isSiteLimitReached && setShowCreateModal(true)}
              disabled={isSiteLimitReached}
            >
              <Plus className="mr-2 h-4 w-4" /> Add New Site
            </Button>
          </TooltipTrigger>
          {isSiteLimitReached && (
            <TooltipContent className="text-xs bg-white rounded-md">
              <p>Maximum of {MAX_SITES} sites allowed</p>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
      {showCreateModal && (
        <CreateSiteModal
          open={showCreateModal}
          onOpenChange={setShowCreateModal}
          onCreateSite={handleCreateSite}
          isCreating={isCreatingSite}
        />
      )}
    </>
  );
}
