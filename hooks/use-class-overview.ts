"use client"

import { useState, useEffect } from "react"
import { apiClient } from "@/lib/api-client"

interface ClassOverviewItem {
  grade: string
  students: number
  capacity: number
  color: string
}

export function useClassOverview() {
  const [classes, setClasses] = useState<ClassOverviewItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchClassOverview = async () => {
      setIsLoading(true)
      try {
        const classesRes = await apiClient.getClasses()
        const classesData = classesRes.data?.data || []

        const colors = ["bg-blue-500", "bg-green-500", "bg-amber-500", "bg-purple-500", "bg-pink-500"]
        const formattedClasses: ClassOverviewItem[] = classesData.slice(0, 5).map((cls: any, index: number) => ({
          grade: cls.name || `Grade ${10 + index}`,
          students: cls.studentCount || 0,
          capacity: cls.capacity || 280,
          color: colors[index % colors.length],
        }))

        setClasses(formattedClasses)
      } catch (err) {
        setError("Failed to load class overview")
        console.error("Error fetching class overview:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchClassOverview()
  }, [])

  return { classes, isLoading, error }
}
