"use client"

import type React from "react"

import { useParams, usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, FileText, PenTool, Settings, ChevronRight } from "lucide-react"

const navigationItems = [
  { id: "submissions", label: "Submissions", icon: FileText, href: "/submissions" },
  { id: "blogs", label: "Blogs", icon: PenTool, href: "/blogs" },
  { id: "settings", label: "Settings", icon: Settings, href: "/settings" },
]

const getProjectName = (projectId: string) => {
  const projects: Record<string, string> = {
    "my-awesome-website": "My Awesome Website",
    "portfolio-site": "Portfolio Site",
    "blog-project": "Blog Project",
  }
  return projects[projectId] || projectId
}

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const params = useParams()
  const pathname = usePathname()
  const projectId = params.projectId as string
  const projectName = getProjectName(projectId)

  const getCurrentPageName = () => {
    if (pathname.includes("/submissions")) return "Submissions"
    if (pathname.includes("/blogs/new")) return "New Blog"
    if (pathname.includes("/blogs") && pathname.includes("/edit")) return "Edit Blog"
    if (pathname.includes("/blogs")) return "Blogs"
    if (pathname.includes("/settings")) return "Settings"
    return "Dashboard"
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="flex items-center justify-between px-8 py-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                All Projects
              </Button>
            </Link>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-foreground transition-colors">
                Projects
              </Link>
              <ChevronRight className="h-4 w-4" />
              <Link href={`/project/${projectId}`} className="hover:text-foreground transition-colors">
                {projectName}
              </Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-foreground font-medium">{getCurrentPageName()}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-sm font-medium">{projectName}</div>
              <div className="text-xs text-muted-foreground">{projectId}.webbuilder.app</div>
            </div>
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-8">
          <nav className="flex space-x-8">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const href = `/project/${projectId}${item.href}`
              const isActive = pathname === href || (pathname.startsWith(href) && href !== "/project/" + projectId)

              return (
                <Link
                  key={item.id}
                  href={href}
                  className={`flex items-center gap-2 px-1 py-4 text-sm font-medium border-b-2 transition-colors ${
                    isActive
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8">{children}</div>
    </div>
  )
}
