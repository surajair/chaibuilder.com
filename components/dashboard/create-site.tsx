"use client";

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

import { Button } from "../ui/button";
import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@chaibuilder/sdk/ui";
import { createSite } from "@/actions/create-site-action";
import { toast } from "sonner";
import Loader from "./loader";
import { Logo } from "../builder/logo";

const MAX_SITES = 2;

interface CreateSiteModalProps {
  open: boolean;
  isSiteLimitReached: boolean;
  onOpenChange: (open: boolean) => void;
}

const AVAILABLE_LANGUAGES = [
  { name: "English", code: "en" },
  { name: "Spanish", code: "es" },
  { name: "French", code: "fr" },
  { name: "Portuguese", code: "pt" },
  { name: "Russian", code: "ru" },
];

function CreateSiteModal({
  open,
  isSiteLimitReached,
  onOpenChange,
}: CreateSiteModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    fallbackLang: "en",
    languages: ["en"] as string[],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const result = await createSite(formData);
      if (result.success) {
        toast.success("Site created successfully!");
        setFormData({
          name: "",
          fallbackLang: "",
          languages: [],
        });
        onOpenChange(false);
      } else {
        toast.error(result.error || "Failed to create site");
      }
    } catch (error) {
      toast.error("An error occurred while creating the site");
    }
    setLoading(false);
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
      {isSiteLimitReached ? (
        <DialogContent className="bg-white">
          <Logo shouldRedirect={false} />
          <DialogHeader>
            <DialogTitle>Website Limit Reached</DialogTitle>
            <DialogDescription>
              You have reached the maximum number of websites allowed. If you
              need more, please reach out to us on{" "}
              <a
                className="underline text-blue-500 hover:text-blue-400"
                href="https://discord.gg/QPzCkjq5"
              >
                Discord
              </a>{" "}
              for further assistance.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      ) : (
        <DialogContent className="sm:max-w-[500px] z-[999] bg-white">
          <DialogHeader>
            <DialogTitle>Create New Site</DialogTitle>
            <DialogDescription>
              Fill in the details to create a new site.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-1">
                <Label htmlFor="name">Website Name</Label>
                <Input
                  id="name"
                  type="text"
                  size={60}
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter website name"
                  required
                  disabled={loading}
                  className="focus-visible:ring-0 border-0 focus-visible:ring-transparent border-b rounded-none px-0 !text-2xl text-purple-800 font-bold"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fallback-lang">Default Language</Label>
                <Select
                  value={formData.fallbackLang}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      fallbackLang: value,
                      languages: formData.languages.includes(value)
                        ? formData.languages
                        : [...formData.languages, value],
                    })
                  }
                  required
                  disabled={loading}
                >
                  <SelectTrigger id="fallback-lang" className="h-10">
                    <SelectValue placeholder="Select a language" />
                  </SelectTrigger>
                  <SelectContent className="bg-white z-[9999]">
                    {AVAILABLE_LANGUAGES.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Note: Once set, the default language{" "}
                  <span className="text-black font-medium">cannot</span> be
                  changed.
                </p>
              </div>

              <div className="space-y-2">
                <Label>Additional Languages</Label>
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_LANGUAGES.map((lang) => {
                    const isSelected = formData.languages.includes(lang.code);
                    return (
                      <Button
                        key={lang.code}
                        type="button"
                        variant={isSelected ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleLanguage(lang.code)}
                        disabled={
                          lang.code === formData.fallbackLang || loading
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

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-gray-900 hover:bg-gray-700"
                disabled={loading || !formData.name || !formData.fallbackLang}
              >
                {loading ? (
                  <>
                    <Loader />
                    Creating...
                  </>
                ) : (
                  "Create Site"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      )}
    </Dialog>
  );
}

export function CreateSite({
  isSiteLimitReached,
}: {
  isSiteLimitReached: boolean;
}) {
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="default"
              onClick={() => setShowCreateModal(true)}
              className="bg-black hover:bg-black/80"
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
          isSiteLimitReached={isSiteLimitReached}
        />
      )}
    </>
  );
}
