"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function UsageSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold text-foreground">Usage Analytics</h1>
        <p className="text-muted-foreground mt-2">Monitor your project's resource usage and performance metrics.</p>
      </div>

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
  )
}
