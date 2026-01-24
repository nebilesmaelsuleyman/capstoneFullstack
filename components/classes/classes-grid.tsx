'use client'

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Clock } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface ClassItem {
  id: number
  class_name: string
  class_code: string
  teacher_name: string
  student_count: string
  capacity: number
  academic_year: string
  grade_level: number
  section: string
}

export function ClassesGrid() {
  const [classes, setClasses] = useState<ClassItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchClasses() {
      try {
        const token = localStorage.getItem('auth_token');
        const response = await fetch('http://localhost:4000/api/classes', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        if (response.ok) {
          const data = await response.json()
          setClasses(data)
        }
      } catch (error) {
        console.error("Failed to fetch classes", error)
      } finally {
        setLoading(false)
      }
    }

    fetchClasses()
  }, [])

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="h-[200px] w-full" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {classes.map((classItem) => {
        const studentCount = Number(classItem.student_count || 0)
        const occupancyPercentage = (studentCount / classItem.capacity) * 100
        const isFull = occupancyPercentage >= 100

        return (
          <Card key={classItem.id} className="hover:border-primary transition-colors">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{classItem.class_name}</CardTitle>
                  <CardDescription className="mt-1">{classItem.class_code}</CardDescription>
                </div>
                <Badge variant="outline">Grade {classItem.grade_level}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>
                    {studentCount}/{classItem.capacity} students
                  </span>
                  {isFull && (
                    <Badge variant="destructive" className="ml-auto text-xs">
                      Full
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{classItem.academic_year}</span>
                </div>
              </div>
              <div className="border-border border-t pt-4">
                <p className="text-muted-foreground text-sm">Instructor</p>
                <p className="font-medium text-sm">{classItem.teacher_name || "Unassigned"}</p>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
