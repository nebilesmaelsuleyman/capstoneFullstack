"use client"

import { useState, useEffect } from "react"
import { apiClient } from "@/lib/api-client"

export function useDashboardStats() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    activeClasses: 0,
    attendanceRate: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true)
      try {
        const [studentsRes, teachersRes, classesRes] = await Promise.all([
          apiClient.getStudents(1, 1000),
          apiClient.getTeachers(1, 1000),
          apiClient.getClasses(1, 1000),
        ])

        // Students response is { data: { data: [...], total: ... } }
        const studentCount = studentsRes.data?.data?.length || studentsRes.data?.length || 0
        // Teachers response is an array directly
        const teacherCount = Array.isArray(teachersRes.data) ? teachersRes.data.length : (teachersRes.data as any)?.length || 0
        // Classes response is an array directly
        const classCount = Array.isArray(classesRes.data) ? classesRes.data.length : (classesRes.data as any)?.length || 0

        setStats({
          totalStudents: studentCount,
          totalTeachers: teacherCount,
          activeClasses: classCount,
          attendanceRate: 94.2,
        })
      } catch (err) {
        setError("Failed to load statistics")
        console.error("Error fetching stats:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  return { stats, isLoading, error }
}
