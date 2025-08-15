import { redirect } from "next/navigation"

export default function ProjectPage({ params }: { params: { projectId: string } }) {
  // Redirect to submissions as the default view
  redirect(`/project/${params.projectId}/submissions`)
}
