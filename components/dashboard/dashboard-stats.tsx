"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, GraduationCap, BookOpen, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { useDashboardStats } from "@/hooks/use-dashboard-stats"
import { cn } from "@/lib/utils"

export function DashboardStats() {
  const { stats, isLoading } = useDashboardStats()

  const statsData = [
    {
      title: "Total Students",
      value: stats.totalStudents.toString(),
      change: "+12% from last term",
      icon: Users,
      trend: "up",
      color: "blue",
    },
    {
      title: "Total Teachers",
      value: stats.totalTeachers.toString(),
      change: "Active educators",
      icon: GraduationCap,
      trend: "up",
      color: "purple",
    },
    {
      title: "Active Classes",
      value: stats.activeClasses.toString(),
      change: "Currently running",
      icon: BookOpen,
      trend: "stable",
      color: "pink",
    },
    {
      title: "Attendance Rate",
      value: `${stats.attendanceRate}%`,
      change: "System average",
      icon: TrendingUp,
      trend: "up",
      color: "emerald",
    },
  ]

  const colorMap = {
    blue: "from-blue-500/20 to-cyan-500/20 text-blue-400 border-blue-500/20",
    purple: "from-purple-500/20 to-indigo-500/20 text-purple-400 border-purple-500/20",
    pink: "from-pink-500/20 to-rose-500/20 text-pink-400 border-pink-500/20",
    emerald: "from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/20",
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {statsData.map((stat) => {
        const Icon = stat.icon
        const colors = colorMap[stat.color as keyof typeof colorMap]

        return (
          <Card key={stat.title} className="group relative overflow-hidden border-slate-800 bg-slate-900/40 backdrop-blur-md transition-all duration-300 hover:scale-[1.02] hover:bg-slate-900/60 border-0 shadow-lg">
            <div className={cn("absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gradient-to-br opacity-10 blur-2xl group-hover:opacity-20 transition-opacity", colors)}></div>

            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="font-bold text-xs uppercase tracking-widest text-slate-400">{stat.title}</CardTitle>
              <div className={cn("p-2 rounded-xl border flex items-center justify-center", colors)}>
                <Icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <div className="text-3xl font-black text-white tracking-tight">
                  {isLoading ? "..." : stat.value}
                </div>
                {stat.trend === "up" && (
                  <div className="flex items-center text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded-md">
                    <ArrowUpRight className="h-3 w-3 mr-0.5" />
                    UP
                  </div>
                )}
              </div>
              <p className="text-slate-500 text-xs mt-1 font-medium italic">{stat.change}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
