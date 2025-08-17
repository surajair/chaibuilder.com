import { redirect } from "next/navigation";

export default function ProjectPage({ params }: { params: { websiteId: string } }) {
  redirect(`/websites/website/${params.websiteId}/details`);
}
