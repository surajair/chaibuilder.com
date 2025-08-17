import { redirect } from "next/navigation";

export default function ProjectPage({ params }: { params: { websiteId: string } }) {
  redirect(`/website/${params.websiteId}/details`);
}
