"use client"

import type React from "react"

import { useParams, usePathname } from "next/navigation"
import Link from "next/link"
import { Settings, Key, Globe, BarChart3, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

const sidebarItems = [
  { id: "general", label: "General", icon: Settings },
  { id: "api-key", label: "API Key", icon: Key },
  { id: "domain", label: "Domain", icon: Globe },
  { id: "usage", label: "Usage", icon: BarChart3 },
]

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const params = useParams()
  const pathname = usePathname()
  const projectId = params.projectId as string

  return (
    <div className="flex min-h-screen bg-background -m-8">
      {/* Sidebar */}
      <div className="w-64 bg-sidebar border-r border-sidebar-border">
        <div className="p-6">
          <h2 className="text-lg font-playfair font-semibold text-sidebar-foreground">Project Settings</h2>
          <p className="text-sm text-muted-foreground mt-1">Configure your project</p>
        </div>

        <nav className="px-3">
          {sidebarItems.map((item) => {
            const Icon = item.icon
            const href = `/project/${projectId}/settings/${item.id}`
            const isActive = pathname === href

            return (
              <Link
                key={item.id}
                href={href}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">{children}</div>
    </div>
  )
}
