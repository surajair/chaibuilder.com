"use client"

import { useEffect } from "react"
import { useRouter, useParams } from "next/navigation"

export default function SettingsPage() {
  const router = useRouter()
  const params = useParams()
  const projectId = params.projectId as string

  useEffect(() => {
    router.replace(`/project/${projectId}/settings/general`)
  }, [router, projectId])

  return null
}
