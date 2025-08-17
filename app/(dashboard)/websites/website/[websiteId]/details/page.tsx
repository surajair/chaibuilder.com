"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SettingsPage() {
  const router = useRouter();
  const params = useParams();
  const websiteId = params.websiteId as string;

  useEffect(() => {
    router.replace(`/project/${websiteId}/settings/general`);
  }, [router, websiteId]);

  return null;
}
