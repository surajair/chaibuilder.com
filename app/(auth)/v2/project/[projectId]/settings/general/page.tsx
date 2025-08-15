"use client"

import { useState, useActionState } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
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
} from "@/components/ui/alert-dialog"
import { updateProjectSettings, deleteProject } from "../actions"

export default function GeneralSettingsPage() {
  const params = useParams()
  const projectId = params.projectId as string

  const [projectName, setProjectName] = useState("My Awesome Website")
  const defaultLanguage = "en" // Cannot be changed
  const [additionalLanguages, setAdditionalLanguages] = useState<string[]>([])
  const [deleteConfirmation, setDeleteConfirmation] = useState("")

  // Form action for updating project settings
  const [updateState, updateAction, updatePending] = useActionState(
    async (prevState: any, formData: FormData) => {
      const result = await updateProjectSettings(formData)
      return result
    },
    { success: false }
  )

  // Form action for deleting project
  const [deleteState, deleteAction, deletePending] = useActionState(
    async (prevState: any, formData: FormData) => {
      const result = await deleteProject(formData)
      return result
    },
    { success: false }
  )

  const availableLanguages = [
    { value: "es", label: "Spanish" },
    { value: "fr", label: "French" },
    { value: "de", label: "German" },
    { value: "it", label: "Italian" },
    { value: "pt", label: "Portuguese" },
    { value: "ja", label: "Japanese" },
    { value: "ko", label: "Korean" },
    { value: "zh", label: "Chinese" },
  ]

  const handleLanguageToggle = (languageValue: string, checked: boolean) => {
    if (checked && additionalLanguages.length < 2) {
      setAdditionalLanguages([...additionalLanguages, languageValue])
    } else if (!checked) {
      setAdditionalLanguages(additionalLanguages.filter((lang) => lang !== languageValue))
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold text-foreground">General Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your project&lsquo;s basic configuration and settings.</p>
        <p className="text-xs text-muted-foreground mt-1">Project ID: {projectId}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project Information</CardTitle>
          <CardDescription>Update your project name and language settings</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={updateAction} className="space-y-4">
            <input type="hidden" name="projectId" value={projectId} />
            <div className="space-y-2">
              <Label htmlFor="project-name">Project Name</Label>
              <Input
                id="project-name"
                name="projectName"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Enter project name"
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
              <p className="text-xs text-muted-foreground">Select up to 2 additional languages for your project</p>
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

      <Card className="border-destructive/20">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>Permanently delete this project and all of its data</CardDescription>
        </CardHeader>
        <CardContent>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Delete Project</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your project and remove all data from our
                  servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <form action={deleteAction}>
                <input type="hidden" name="projectId" value={projectId} />
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
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {deletePending ? "Deleting..." : "Delete Project"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </form>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  )
}
