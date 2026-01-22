"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Clock } from "lucide-react"

export default function TimetablePage() {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
  const timeSlots = [
    { start: "08:00", end: "09:00" },
    { start: "09:00", end: "10:00" },
    { start: "10:00", end: "11:00" },
    { start: "11:00", end: "12:00" },
    { start: "12:00", end: "13:00" },
    { start: "13:00", end: "14:00" },
    { start: "14:00", end: "15:00" },
  ]

  const timetable: any = {
    Monday: [
      { subject: "Mathematics", teacher: "Dr. Smith", room: "101" },
      { subject: "English", teacher: "Ms. Johnson", room: "102" },
      { subject: "Science", teacher: "Mr. Brown", room: "103" },
      { subject: "History", teacher: "Ms. Davis", room: "104" },
      { subject: "Lunch Break", teacher: "", room: "" },
      { subject: "Physical Education", teacher: "Coach Wilson", room: "Gym" },
      { subject: "Art", teacher: "Ms. Taylor", room: "105" },
    ],
    Tuesday: [
      { subject: "Science", teacher: "Mr. Brown", room: "103" },
      { subject: "Mathematics", teacher: "Dr. Smith", room: "101" },
      { subject: "English", teacher: "Ms. Johnson", room: "102" },
      { subject: "Computer Science", teacher: "Mr. Anderson", room: "Lab 1" },
      { subject: "Lunch Break", teacher: "", room: "" },
      { subject: "History", teacher: "Ms. Davis", room: "104" },
      { subject: "Music", teacher: "Mr. Martin", room: "106" },
    ],
    Wednesday: [
      { subject: "Mathematics", teacher: "Dr. Smith", room: "101" },
      { subject: "Science", teacher: "Mr. Brown", room: "103" },
      { subject: "English", teacher: "Ms. Johnson", room: "102" },
      { subject: "Geography", teacher: "Ms. White", room: "107" },
      { subject: "Lunch Break", teacher: "", room: "" },
      { subject: "Physical Education", teacher: "Coach Wilson", room: "Gym" },
      { subject: "Library", teacher: "", room: "Library" },
    ],
    Thursday: [
      { subject: "English", teacher: "Ms. Johnson", room: "102" },
      { subject: "Mathematics", teacher: "Dr. Smith", room: "101" },
      { subject: "Computer Science", teacher: "Mr. Anderson", room: "Lab 1" },
      { subject: "Science", teacher: "Mr. Brown", room: "103" },
      { subject: "Lunch Break", teacher: "", room: "" },
      { subject: "Art", teacher: "Ms. Taylor", room: "105" },
      { subject: "History", teacher: "Ms. Davis", room: "104" },
    ],
    Friday: [
      { subject: "Science", teacher: "Mr. Brown", room: "103" },
      { subject: "English", teacher: "Ms. Johnson", room: "102" },
      { subject: "Mathematics", teacher: "Dr. Smith", room: "101" },
      { subject: "Music", teacher: "Mr. Martin", room: "106" },
      { subject: "Lunch Break", teacher: "", room: "" },
      { subject: "Physical Education", teacher: "Coach Wilson", room: "Gym" },
      { subject: "Free Period", teacher: "", room: "" },
    ],
  }

  const getSubjectColor = (subject: string) => {
    const colors: any = {
      Mathematics: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      English: "bg-purple-500/10 text-purple-500 border-purple-500/20",
      Science: "bg-green-500/10 text-green-500 border-green-500/20",
      History: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
      "Physical Education": "bg-red-500/10 text-red-500 border-red-500/20",
      Art: "bg-pink-500/10 text-pink-500 border-pink-500/20",
      Music: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
      "Computer Science": "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
      Geography: "bg-orange-500/10 text-orange-500 border-orange-500/20",
      "Lunch Break": "bg-muted text-muted-foreground border-border",
      Library: "bg-violet-500/10 text-violet-500 border-violet-500/20",
      "Free Period": "bg-muted text-muted-foreground border-border",
    }
    return colors[subject] || "bg-muted text-muted-foreground border-border"
  }

  return (
    <div className="flex flex-col gap-8 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-semibold text-3xl text-balance">Timetable</h1>
          <p className="text-muted-foreground">View weekly class schedule</p>
        </div>
        <div className="w-64">
          <Label htmlFor="class">Select Class</Label>
          <Select defaultValue="1">
            <SelectTrigger id="class">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Grade 9 - Section A</SelectItem>
              <SelectItem value="2">Grade 9 - Section B</SelectItem>
              <SelectItem value="3">Grade 10 - Section A</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Weekly Schedule</CardTitle>
          <CardDescription>Grade 9 - Section A schedule for current week</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <div className="grid grid-cols-6 gap-2">
                {/* Header - Time Column */}
                <div className="space-y-2">
                  <div className="flex h-12 items-center justify-center rounded-lg bg-primary px-3 font-semibold text-primary-foreground text-sm">
                    Time
                  </div>
                  {timeSlots.map((slot, idx) => (
                    <div
                      key={idx}
                      className="flex h-20 flex-col items-center justify-center rounded-lg border bg-card px-2"
                    >
                      <Clock className="mb-1 h-4 w-4 text-muted-foreground" />
                      <span className="font-medium text-xs">{slot.start}</span>
                      <span className="text-muted-foreground text-xs">{slot.end}</span>
                    </div>
                  ))}
                </div>

                {/* Day Columns */}
                {days.map((day) => (
                  <div key={day} className="space-y-2">
                    <div className="flex h-12 items-center justify-center rounded-lg bg-primary px-3 font-semibold text-primary-foreground text-sm">
                      {day}
                    </div>
                    {timetable[day].map((period: any, idx: number) => (
                      <div
                        key={idx}
                        className={`flex h-20 flex-col justify-center rounded-lg border px-3 py-2 ${getSubjectColor(period.subject)}`}
                      >
                        <p className="font-semibold text-xs leading-tight">{period.subject}</p>
                        {period.teacher && <p className="mt-1 text-xs opacity-80">{period.teacher}</p>}
                        {period.room && (
                          <Badge variant="outline" className="mt-1 w-fit text-xs">
                            {period.room}
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
