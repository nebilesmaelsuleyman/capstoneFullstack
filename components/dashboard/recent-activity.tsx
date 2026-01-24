"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useDashboardActivities } from "@/hooks/use-dashboard-activities"
import { cn } from "@/lib/utils"

export function RecentActivity() {
  const { activities, isLoading } = useDashboardActivities()

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-4 animate-pulse">
            <div className="h-10 w-10 rounded-full bg-slate-800"></div>
            <div className="flex-1 space-y-2">
              <div className="h-3 w-3/4 rounded bg-slate-800"></div>
              <div className="h-2 w-1/2 rounded bg-slate-800"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (activities.length === 0) {
    return <div className="py-8 text-center text-sm text-slate-500 italic">No recent activities recorded</div>
  }

  return (
    <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-800 before:to-transparent">
      {activities.map((activity, index) => (
        <div key={index} className="flex items-start gap-4 relative group">
          <Avatar className="h-10 w-10 border-2 border-slate-900 ring-2 ring-slate-800 group-hover:ring-indigo-500 transition-all">
            <AvatarFallback className="bg-slate-800 text-indigo-400 font-bold text-xs">{activity.initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0 pt-0.5">
            <p className="text-sm text-slate-300 leading-snug">
              <span className="font-bold text-white transition-colors group-hover:text-indigo-400">{activity.user}</span>{" "}
              <span>{activity.action}</span>
            </p>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-slate-500 text-[10px] uppercase font-bold tracking-tighter">{activity.time}</p>
              <div className="h-1 w-1 rounded-full bg-slate-700"></div>
              <span className="text-[10px] text-indigo-500/60 font-medium">System Log</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
