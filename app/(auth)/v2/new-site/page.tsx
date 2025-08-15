"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus, X, Globe } from "lucide-react"
import Link from "next/link"

const availableLanguages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "es", name: "Spanish", flag: "🇪🇸" },
  { code: "fr", name: "French", flag: "🇫🇷" },
  { code: "de", name: "German", flag: "🇩🇪" },
  { code: "it", name: "Italian", flag: "🇮🇹" },
  { code: "pt", name: "Portuguese", flag: "🇵🇹" },
  { code: "nl", name: "Dutch", flag: "🇳🇱" },
  { code: "ja", name: "Japanese", flag: "🇯🇵" },
  { code: "ko", name: "Korean", flag: "🇰🇷" },
  { code: "zh", name: "Chinese", flag: "🇨🇳" },
]

export default function NewSitePage() {
  const router = useRouter()
  const [siteName, setSiteName] = useState("")
  const [subdomain, setSubdomain] = useState("")
  const [defaultLanguage, setDefaultLanguage] = useState("en")
  const [additionalLanguages, setAdditionalLanguages] = useState<string[]>([])
  const [isCreating, setIsCreating] = useState(false)

  // Generate subdomain from site name
  const generateSubdomain = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
  }

  const handleSiteNameChange = (value: string) => {
    setSiteName(value)
    setSubdomain(generateSubdomain(value))
  }

  const handleAddLanguage = (languageCode: string) => {
    if (
      additionalLanguages.length < 2 &&
      !additionalLanguages.includes(languageCode) &&
      languageCode !== defaultLanguage
    ) {
      setAdditionalLanguages([...additionalLanguages, languageCode])
    }
  }

  const handleRemoveLanguage = (languageCode: string) => {
    setAdditionalLanguages(additionalLanguages.filter((lang) => lang !== languageCode))
  }

  const handleCreateSite = async () => {
    if (!siteName.trim() || !subdomain.trim()) return

    setIsCreating(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // In real app, this would create the site via API
    console.log("Creating site:", {
      siteName,
      subdomain,
      defaultLanguage,
      additionalLanguages,
    })

    // Redirect to the new project
    router.push(`/project/${subdomain}`)
  }

  const getLanguageName = (code: string) => {
    return availableLanguages.find((lang) => lang.code === code)?.name || code
  }

  const getLanguageFlag = (code: string) => {
    return availableLanguages.find((lang) => lang.code === code)?.flag || "🌐"
  }

  const availableToAdd = availableLanguages.filter(
    (lang) => lang.code !== defaultLanguage && !additionalLanguages.includes(lang.code),
  )

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Projects
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-playfair font-bold">Add New Site</h1>
            <p className="text-muted-foreground mt-1">Create a new website project</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Site Configuration</CardTitle>
            <CardDescription>Set up your new website with basic configuration options</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Site Name */}
            <div className="space-y-2">
              <Label htmlFor="siteName">Site Name</Label>
              <Input
                id="siteName"
                value={siteName}
                onChange={(e) => handleSiteNameChange(e.target.value)}
                placeholder="My Awesome Website"
                className="text-lg"
              />
            </div>

            {/* Subdomain Preview */}
            <div className="space-y-2">
              <Label>Subdomain</Label>
              <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <span className="font-mono text-sm">{subdomain || "your-site-name"}.chaibuilder.app</span>
              </div>
              <p className="text-xs text-muted-foreground">This subdomain cannot be changed after creation</p>
            </div>

            {/* Default Language */}
            <div className="space-y-2">
              <Label>Default Language</Label>
              <Select value={defaultLanguage} onValueChange={setDefaultLanguage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableLanguages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      <div className="flex items-center gap-2">
                        <span>{lang.flag}</span>
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
                      <span>{getLanguageFlag(langCode)}</span>
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
                <Select onValueChange={handleAddLanguage}>
                  <SelectTrigger>
                    <SelectValue placeholder="Add another language" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableToAdd.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        <div className="flex items-center gap-2">
                          <span>{lang.flag}</span>
                          <span>{lang.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* Language Summary */}
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium mb-2">Language Configuration</h4>
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  <span>{getLanguageFlag(defaultLanguage)}</span>
                  <span>{getLanguageName(defaultLanguage)}</span>
                  <Badge variant="outline" className="text-xs">
                    Default
                  </Badge>
                </div>
                {additionalLanguages.map((langCode) => (
                  <div key={langCode} className="flex items-center gap-2">
                    <span>{getLanguageFlag(langCode)}</span>
                    <span>{getLanguageName(langCode)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Create Button */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleCreateSite}
                disabled={!siteName.trim() || !subdomain.trim() || isCreating}
                className="flex-1"
              >
                {isCreating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating Site...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Site
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
  )
}
