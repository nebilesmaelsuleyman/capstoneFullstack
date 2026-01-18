"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, GraduationCap, BookOpen, TrendingUp } from "lucide-react"
import { useDashboardStats } from "@/hooks/use-dashboard-stats"

export function DashboardStats() {
  const { stats, isLoading } = useDashboardStats()

  const statsData = [
    {
      title: "Total Students",
      value: stats.totalStudents.toString(),
      change: "Active in system",
      icon: Users,
      trend: "up",
    },
    {
      title: "Total Teachers",
      value: stats.totalTeachers.toString(),
      change: "Teaching staff",
      icon: GraduationCap,
      trend: "up",
    },
    {
      title: "Active Classes",
      value: stats.activeClasses.toString(),
      change: "Classes available",
      icon: BookOpen,
      trend: "stable",
    },
    {
      title: "Attendance Rate",
      value: `${stats.attendanceRate}%`,
      change: "Current average",
      icon: TrendingUp,
      trend: "up",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statsData.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="font-medium text-sm">{stat.title}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="font-bold text-2xl">{isLoading ? "..." : stat.value}</div>
              <p className="text-muted-foreground text-xs">{stat.change}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
