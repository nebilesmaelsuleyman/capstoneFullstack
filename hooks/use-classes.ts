"use client"

import { useState, useEffect } from "react"
import { apiClient } from "@/lib/api-client"

export function useClasses() {
  const [classes, setClasses] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchClasses = async () => {
      setIsLoading(true)
      const response = await apiClient.getClasses()
      if (response.error) {
        setError(response.error)
      } else {
        setClasses(response.data?.data || [])
      }
      setIsLoading(false)
    }

    fetchClasses()
  }, [])

  const addClass = async (classData: any) => {
    const response = await apiClient.createClass(classData)
    if (response.error) {
      setError(response.error)
      return { success: false, error: response.error }
    }
    setClasses([...classes, response.data])
    return { success: true }
  }

  return { classes, isLoading, error, addClass }
}
