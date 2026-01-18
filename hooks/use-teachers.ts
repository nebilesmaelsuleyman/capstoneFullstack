"use client"

import { useState, useEffect } from "react"
import { apiClient } from "@/lib/api-client"

export function useTeachers(page = 1, search = "") {
  const [teachers, setTeachers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTeachers = async () => {
      setIsLoading(true)
      const response = await apiClient.getTeachers(page, 10, search)
      if (response.error) {
        setError(response.error)
      } else {
        setTeachers(response.data?.data || [])
      }
      setIsLoading(false)
    }

    fetchTeachers()
  }, [page, search])

  const addTeacher = async (teacherData: any) => {
    const response = await apiClient.createTeacher(teacherData)
    if (response.error) {
      setError(response.error)
      return { success: false, error: response.error }
    }
    setTeachers([...teachers, response.data])
    return { success: true }
  }

  const updateTeacher = async (id: number, teacherData: any) => {
    const response = await apiClient.updateTeacher(id, teacherData)
    if (response.error) {
      setError(response.error)
      return { success: false, error: response.error }
    }
    setTeachers(teachers.map((t) => (t.id === id ? response.data : t)))
    return { success: true }
  }

  const deleteTeacher = async (id: number) => {
    const response = await apiClient.deleteTeacher(id)
    if (response.error) {
      setError(response.error)
      return { success: false, error: response.error }
    }
    setTeachers(teachers.filter((t) => t.id !== id))
    return { success: true }
  }

  return { teachers, isLoading, error, addTeacher, updateTeacher, deleteTeacher }
}
