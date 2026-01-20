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
        console.log("Refresh Data:", response.data);
       const actualData = Array.isArray(response.data) 
      ? response.data 
      : (response.data?.data || []);
      
    setTeachers(actualData);
      }
      setIsLoading(false)
    }

    fetchTeachers()
  }, [page, search])

  const addTeacher = async (teacherData: any) => {
    const response = await apiClient.createTeacher(teacherData)
    if (response.error) {
      setError(response.error);
      return { success: false, error: response.error };
    }
    
    // FIX: Access the inner .data property from the backend response
    const newTeacher = response.data?.data || response.data; 
    setTeachers((prev) => [...prev, newTeacher]);
    
    return { success: true };
  }

  const updateTeacher = async (id: number, teacherData: any) => {
    const response = await apiClient.updateTeacher(id, teacherData);
    if (response.error) {
      setError(response.error);
      return { success: false, error: response.error };
    }

    // FIX: Access the inner .data property
    const updatedTeacher = response.data?.data || response.data;
    setTeachers((prev) => prev.map((t) => (t.id === id ? updatedTeacher : t)));
    
    return { success: true };
  }


// In use-teachers.ts
const deleteTeacher = async (id: number) => {
  console.log("Hook calling delete for ID:", id); // Verify this is a number!
  // Ensure your apiClient isn't wrapping the ID in another object
  const response = await apiClient.deleteTeacher(id); 
  
  if (response.error) {
    setError(response.error);
    return { success: false, error: response.error };
  }
  setTeachers(teachers.filter((t) => t.id !== id));
  return { success: true };
}

  return { 
    teachers, 
    isLoading, 
    error, 
    addTeacher, 
    updateTeacher, 
    deleteTeacher
    
  };
}