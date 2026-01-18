import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function SchedulePage() {
  return (
    <div className="flex flex-col gap-6 p-8">
      <div>
        <h1 className="font-semibold text-3xl text-balance">Schedule</h1>
        <p className="text-muted-foreground">View and manage class schedules</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Weekly Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Schedule view coming soon...</p>
        </CardContent>
      </Card>
    </div>
  )
}
