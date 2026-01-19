"use client"

import { useState, useEffect } from "react"
import { apiClient } from "@/lib/api-client"

export function useStudents(page = 1, search = "") {
  const [students, setStudents] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStudents = async () => {
      setIsLoading(true)
      const response = await apiClient.getStudents(page, 10, search)
      if (response.error) {
        setError(response.error)
      } else {
        setStudents(response.data?.data || [])
      }
      setIsLoading(false)
    }

    fetchStudents()
  }, [page, search])

const addStudent = async (studentData: any) => {
  try {
    const response = await apiClient.createStudent(studentData);
    console.log("Hook createStudent response:", response); // This will show in the BROWSER console   
    if (response.error) {
      setError(response.error);
      return { success: false, error: response.error };
    }

    // assume response.data contains the created student
    setStudents((prev) => [...prev, response.data]);
    return { success: true, data: response.data };
  } catch (err) {
    console.error("Hook Error:", err); // This will show in the BROWSER console
    return { success: false, error: "Network or Server Error" };
  }
};

  const updateStudent = async (id: number, studentData: any) => {
    const response = await apiClient.updateStudent(id, studentData)
    if (response.error) {
      setError(response.error)
      return { success: false, error: response.error }
    }
    setStudents(students.map((s) => (s.id === id ? response.data : s)))
    return { success: true }
  }

  const deleteStudent = async (id: number) => {
    const response = await apiClient.deleteStudent(id)
    if (response.error) {
      setError(response.error)
      return { success: false, error: response.error }
    }
    setStudents(students.filter((s) => s.id !== id))
    return { success: true }
  }

  return { students, isLoading, error, addStudent, updateStudent, deleteStudent }
}
