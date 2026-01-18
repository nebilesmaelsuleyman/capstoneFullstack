"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useDashboardActivities } from "@/hooks/use-dashboard-activities"

export function RecentActivity() {
  const { activities, isLoading } = useDashboardActivities()

  if (isLoading) {
    return <div className="text-sm text-muted-foreground">Loading activities...</div>
  }

  if (activities.length === 0) {
    return <div className="text-sm text-muted-foreground">No recent activities</div>
  }

  return (
    <div className="space-y-6">
      {activities.map((activity, index) => (
        <div key={index} className="flex items-start gap-4">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-secondary text-xs">{activity.initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <p className="text-sm">
              <span className="font-medium">{activity.user}</span>{" "}
              <span className="text-muted-foreground">{activity.action}</span>
            </p>
            <p className="text-muted-foreground text-xs">{activity.time}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
