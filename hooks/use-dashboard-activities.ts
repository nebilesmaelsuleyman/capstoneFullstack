"use client"

import { useState, useEffect } from "react"
import { apiClient } from "@/lib/api-client"

interface Activity {
  user: string
  action: string
  time: string
  initials: string
}

export function useDashboardActivities() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchActivities = async () => {
      setIsLoading(true)
      try {
        const announcementsRes = await apiClient.getAnnouncements()
        const announcements = announcementsRes.data?.data || []

        const formattedActivities: Activity[] = announcements.slice(0, 5).map((announcement: any) => ({
          user: announcement.author || "System",
          action: announcement.title,
          time: new Date(announcement.createdAt).toLocaleDateString(),
          initials: (announcement.author || "S")
            .split(" ")
            .map((n: string) => n[0])
            .join("")
            .substring(0, 2)
            .toUpperCase(),
        }))

        setActivities(formattedActivities)
      } catch (err) {
        setError("Failed to load activities")
        console.error("Error fetching activities:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchActivities()
  }, [])

  return { activities, isLoading, error }
}
