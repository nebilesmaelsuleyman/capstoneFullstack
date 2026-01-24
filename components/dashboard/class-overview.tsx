"use client"

import { Progress } from "@/components/ui/progress"
import { useClassOverview } from "@/hooks/use-class-overview"
import { cn } from "@/lib/utils"

export function ClassOverview() {
  const { classes, isLoading } = useClassOverview()

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="space-y-2 animate-pulse">
            <div className="h-4 w-24 bg-slate-800 rounded"></div>
            <div className="h-2 w-full bg-slate-800 rounded"></div>
          </div>
        ))}
      </div>
    )
  }

  if (classes.length === 0) {
    return <div className="py-8 text-center text-sm text-slate-500 italic">Data visualization pending...</div>
  }

  const gradeColors: Record<string, string> = {
    "Grade 9": "bg-blue-500",
    "Grade 10": "bg-purple-500",
    "Grade 11": "bg-pink-500",
    "Grade 12": "bg-indigo-500",
  }

  return (
    <div className="space-y-6">
      {classes.map((classItem) => {
        const percentage = (classItem.students / classItem.capacity) * 100
        const color = gradeColors[classItem.grade] || "bg-slate-500"

        return (
          <div key={classItem.grade} className="space-y-3 group">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={cn("h-2 w-2 rounded-full", color)}></div>
                <span className="font-bold text-sm text-white/90 group-hover:text-white transition-colors">{classItem.grade}</span>
              </div>
              <span className="text-xs font-mono text-slate-500">
                <span className="text-white font-bold">{classItem.students}</span>
                <span className="mx-1">/</span>
                <span>{classItem.capacity}</span>
              </span>
            </div>
            <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-800/50">
              <div
                className={cn("h-full transition-all duration-1000 ease-out rounded-full", color)}
                style={{ width: `${percentage}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
