"use client"

import { Progress } from "@/components/ui/progress"
import { useClassOverview } from "@/hooks/use-class-overview"

export function ClassOverview() {
  const { classes, isLoading } = useClassOverview()

  if (isLoading) {
    return <div className="text-sm text-muted-foreground">Loading class overview...</div>
  }

  if (classes.length === 0) {
    return <div className="text-sm text-muted-foreground">No classes available</div>
  }

  return (
    <div className="space-y-6">
      {classes.map((classItem) => {
        const percentage = (classItem.students / classItem.capacity) * 100

        return (
          <div key={classItem.grade} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{classItem.grade}</span>
              <span className="text-muted-foreground">
                {classItem.students}/{classItem.capacity}
              </span>
            </div>
            <Progress value={percentage} className="h-2" />
          </div>
        )
      })}
    </div>
  )
}
