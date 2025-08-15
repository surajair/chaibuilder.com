import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Globe } from "lucide-react"

const mockProjects = [
  {
    id: "1",
    name: "My Portfolio",
    domain: "portfolio.mysite.com",
    customDomain: "johnsmith.com",
    lastUpdated: "2 hours ago",
    languages: ["en", "es"],
  },
  {
    id: "2",
    name: "E-commerce Store",
    domain: "store.mysite.com",
    lastUpdated: "1 day ago",
    languages: ["en"],
  },
  {
    id: "3",
    name: "Blog Site",
    domain: "blog.mysite.com",
    customDomain: "myblog.net",
    lastUpdated: "3 days ago",
    languages: ["en", "fr", "de"],
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Your Projects</h1>
            <p className="text-muted-foreground">Manage your websites and create amazing content</p>
          </div>
          <Link href="/new-site">
            <Button size="lg" className="gap-2">
              <Plus className="h-5 w-5" />
              Add New Site
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockProjects.map((project) => (
            <Card key={project.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <Link href={`/project/${project.id}`}>
                <CardHeader>
                  <CardTitle className="text-xl">{project.name}</CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <Globe className="h-4 w-4" />
                    {project.customDomain || project.domain}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex gap-1">
                      {project.languages.map((lang) => (
                        <Badge key={lang} variant="outline" className="text-xs">
                          {lang.toUpperCase()}
                        </Badge>
                      ))}
                    </div>
                    <span className="text-muted-foreground">Updated {project.lastUpdated}</span>
                  </div>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>

        {mockProjects.length === 0 && (
          <div className="text-center py-12">
            <Globe className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No projects yet</h3>
            <p className="text-muted-foreground mb-6">Create your first website to get started</p>
            <Link href="/new-site">
              <Button size="lg" className="gap-2">
                <Plus className="h-5 w-5" />
                Create Your First Site
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
