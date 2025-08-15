"use client"

import { useState, useActionState } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
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
import { Globe, ExternalLink, CheckCircle, AlertCircle, Trash2, Settings, Copy } from "lucide-react"
import { addCustomDomain, deleteDomain } from "../actions"

export default function DomainSettingsPage() {
  const params = useParams()
  const projectId = params.projectId as string

  const [customDomain, setCustomDomain] = useState("")
  const [isConfigured, setIsConfigured] = useState(true) // Toggle this to show configuration steps
  const [showConfigSteps, setShowConfigSteps] = useState(false)

  // Form action for adding custom domain
  const [addDomainState, addDomainAction, addDomainPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      const result = await addCustomDomain(formData)
      if (result.success) {
        setCustomDomain("")
      }
      return result
    },
    { success: false, domain: "" }
  )

  // Form action for deleting domain
  const [deleteDomainState, deleteDomainAction, deleteDomainPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      const result = await deleteDomain(formData)
      return result
    },
    { success: false }
  )

  const mockDomains = [
    { domain: "www.example.com", status: "active", configured: true },
    { domain: "blog.example.com", status: "pending", configured: false },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold text-foreground">Domain Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your project&lsquo;s domain configuration.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Default Domain</CardTitle>
          <CardDescription>Your project&lsquo;s default domain provided by our platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <span className="font-mono">{projectId}.webbuilder.app</span>
            <Button variant="ghost" size="sm">
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Custom Domain</CardTitle>
          <CardDescription>Connect your own domain to this project</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form action={addDomainAction} className="space-y-2">
            <input type="hidden" name="projectId" value={projectId} />
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
                  <Badge variant={domainItem.status === "active" ? "outline" : "secondary"}>{domainItem.status}</Badge>

                  {!domainItem.configured && (
                    <Button variant="outline" size="sm" onClick={() => setShowConfigSteps(!showConfigSteps)}>
                      <Settings className="h-4 w-4" />
                      Configure
                    </Button>
                  )}

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
                          Are you sure you want to remove &lsquo;{domainItem.domain}&rsquo; from this project? This action cannot be
                          undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <form action={deleteDomainAction}>
                          <input type="hidden" name="projectId" value={projectId} />
                          <input type="hidden" name="domain" value={domainItem.domain} />
                          <AlertDialogAction
                            type="submit"
                            disabled={deleteDomainPending}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
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

          {showConfigSteps && (
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="text-blue-900">Domain Configuration Steps</CardTitle>
                <CardDescription className="text-blue-700">
                  Follow these steps to configure your domain with Vercel
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center font-medium">
                      1
                    </div>
                    <div>
                      <p className="font-medium text-blue-900">Add DNS Records</p>
                      <p className="text-sm text-blue-700">Add these DNS records to your domain provider:</p>
                      <div className="mt-2 p-3 bg-white rounded border space-y-2">
                        <div className="flex items-center justify-between">
                          <code className="text-xs">A @ 76.76.19.61</code>
                          <Button variant="ghost" size="sm">
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <code className="text-xs">CNAME www cname.vercel-dns.com</code>
                          <Button variant="ghost" size="sm">
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center font-medium">
                      2
                    </div>
                    <div>
                      <p className="font-medium text-blue-900">Wait for Propagation</p>
                      <p className="text-sm text-blue-700">
                        DNS changes can take up to 48 hours to propagate globally.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center font-medium">
                      3
                    </div>
                    <div>
                      <p className="font-medium text-blue-900">SSL Certificate</p>
                      <p className="text-sm text-blue-700">
                        We&lsquo;ll automatically provision an SSL certificate once DNS is configured.
                      </p>
                    </div>
                  </div>
                </div>

                <Button variant="outline" onClick={() => setShowConfigSteps(false)} className="w-full">
                  Hide Configuration Steps
                </Button>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
