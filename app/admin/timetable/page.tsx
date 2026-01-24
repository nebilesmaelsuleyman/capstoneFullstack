"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Clock, Plus, Trash2, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface Class {
  id: number
  class_name: string
  section: string
}

interface Subject {
  id: number
  subject_name: string
  subject_code: string
}

interface Teacher {
  id: number
  user_id: number
  first_name?: string
  last_name?: string
}

interface TimetableEntry {
  id: number
  class_id: number
  subject_id: number
  teacher_id: number | null
  day_of_week: string
  start_time: string
  end_time: string
  room_number: string
  subject_name: string
  subject_code: string
  teacher_first_name?: string
  teacher_last_name?: string
}

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

  const [classes, setClasses] = useState<Class[]>([])
  const [selectedClass, setSelectedClass] = useState<string>("")
  const [timetable, setTimetable] = useState<TimetableEntry[]>([])
  const [loading, setLoading] = useState(false)

  const [subjects, setSubjects] = useState<Subject[]>([])
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    subjectId: "",
    teacherId: "",
    dayOfWeek: "Monday",
    startTime: "08:00",
    endTime: "09:00",
    roomNumber: "",
  })

  useEffect(() => {
    fetchInitialData()
  }, [])

  useEffect(() => {
    if (selectedClass) {
      fetchTimetable(selectedClass)
    }
  }, [selectedClass])

  const fetchInitialData = async () => {
    try {
      const [classesRes, subjectsRes, teachersRes] = await Promise.all([
        fetch("http://localhost:4000/api/classes", { headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` } }),
        fetch("http://localhost:4000/api/subjects", { headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` } }),
        fetch("http://localhost:4000/api/teachers", { headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` } }),
      ])

      if (classesRes.ok) {
        const data = await classesRes.json()
        setClasses(data)
        if (data.length > 0) setSelectedClass(data[0].id.toString())
      }
      if (subjectsRes.ok) setSubjects(await subjectsRes.json())
      if (teachersRes.ok) setTeachers(await teachersRes.json())
    } catch (error) {
      console.error(error)
      toast.error("Failed to load initial data")
    }
  }

  const fetchTimetable = async (classId: string) => {
    setLoading(true)
    try {
      const res = await fetch(`http://localhost:4000/api/timetable/class/${classId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` }
      })
      if (res.ok) {
        const data = await res.json()
        setTimetable(data.data)
      }
    } catch (error) {
      console.error(error)
      toast.error("Failed to fetch timetable")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await fetch("http://localhost:4000/api/timetable", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: JSON.stringify({
          ...formData,
          classId: parseInt(selectedClass),
          subjectId: parseInt(formData.subjectId),
          teacherId: formData.teacherId ? parseInt(formData.teacherId) : null,
        }),
      })

      if (res.ok) {
        toast.success("Timetable entry added")
        setIsDialogOpen(false)
        fetchTimetable(selectedClass)
      } else {
        throw new Error("Failed to add entry")
      }
    } catch (error) {
      toast.error("Failed to add timetable entry")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this entry?")) return
    try {
      const res = await fetch(`http://localhost:4000/api/timetable/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` }
      })
      if (res.ok) {
        toast.success("Entry deleted")
        fetchTimetable(selectedClass)
      }
    } catch (error) {
      toast.error("Failed to delete entry")
    }
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
    }
    return colors[subject] || "bg-muted text-muted-foreground border-border"
  }

  const getEntriesForDayAndTime = (day: string, start: string) => {
    // Basic match, assuming entries align with slots for simplicity in this view
    return timetable.filter(e => e.day_of_week === day && e.start_time.startsWith(start))
  }

  return (
    <div className="flex flex-col gap-8 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-semibold text-3xl text-balance">Timetable</h1>
          <p className="text-muted-foreground">View and manage weekly class schedule</p>
        </div>
        <div className="flex gap-4 items-end">
          <div className="w-64">
            <Label htmlFor="class">Select Class</Label>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger id="class">
                <SelectValue placeholder="Select a class" />
              </SelectTrigger>
              <SelectContent>
                {classes.map(c => (
                  <SelectItem key={c.id} value={c.id.toString()}>
                    {c.class_name} - {c.section}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Entry
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>Add Timetable Entry</DialogTitle>
                  <DialogDescription>Create a new schedule entry for the selected class.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label>Subject</Label>
                    <Select value={formData.subjectId} onValueChange={(val) => setFormData({ ...formData, subjectId: val })}>
                      <SelectTrigger><SelectValue placeholder="Select subject" /></SelectTrigger>
                      <SelectContent>
                        {subjects.map(s => <SelectItem key={s.id} value={s.id.toString()}>{s.subject_name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Teacher (Optional)</Label>
                    <Select value={formData.teacherId} onValueChange={(val) => setFormData({ ...formData, teacherId: val })}>
                      <SelectTrigger><SelectValue placeholder="Select teacher" /></SelectTrigger>
                      <SelectContent>
                        {teachers.map(t => <SelectItem key={t.id} value={t.id.toString()}>{t.first_name} {t.last_name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Day</Label>
                      <Select value={formData.dayOfWeek} onValueChange={(val) => setFormData({ ...formData, dayOfWeek: val })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {days.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Room</Label>
                      <Input value={formData.roomNumber} onChange={e => setFormData({ ...formData, roomNumber: e.target.value })} placeholder="e.g. 101" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Start Time</Label>
                      <Input type="time" value={formData.startTime} onChange={e => setFormData({ ...formData, startTime: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label>End Time</Label>
                      <Input type="time" value={formData.endTime} onChange={e => setFormData({ ...formData, endTime: e.target.value })} />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={submitting}>
                    {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Entry
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Weekly Schedule</CardTitle>
          <CardDescription>
            {classes.find(c => c.id.toString() === selectedClass)?.class_name} - {classes.find(c => c.id.toString() === selectedClass)?.section} schedule
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
          ) : (
            <div className="overflow-x-auto">
              <div className="inline-block min-w-full align-middle">
                <div className="grid grid-cols-6 gap-2">
                  <div className="space-y-2">
                    <div className="flex h-12 items-center justify-center rounded-lg bg-primary px-3 font-semibold text-primary-foreground text-sm">Time</div>
                    {timeSlots.map((slot, idx) => (
                      <div key={idx} className="flex h-24 flex-col items-center justify-center rounded-lg border bg-card px-2">
                        <Clock className="mb-1 h-4 w-4 text-muted-foreground" />
                        <span className="font-medium text-xs">{slot.start}</span>
                        <span className="text-muted-foreground text-xs">{slot.end}</span>
                      </div>
                    ))}
                  </div>

                  {days.map((day) => (
                    <div key={day} className="space-y-2">
                      <div className="flex h-12 items-center justify-center rounded-lg bg-primary px-3 font-semibold text-primary-foreground text-sm">{day}</div>
                      {timeSlots.map((slot, idx) => {
                        const entries = getEntriesForDayAndTime(day, slot.start)
                        return (
                          <div key={idx} className="h-24 relative">
                            {entries.length > 0 ? (
                              entries.map(period => (
                                <div key={period.id} className={`absolute inset-0 flex flex-col justify-center rounded-lg border px-3 py-2 ${getSubjectColor(period.subject_name)}`}>
                                  <div className="flex justify-between items-start">
                                    <p className="font-semibold text-xs leading-tight">{period.subject_name}</p>
                                    <button onClick={() => handleDelete(period.id)} className="hover:text-destructive transition-colors"><Trash2 className="h-3 w-3" /></button>
                                  </div>
                                  {period.teacher_first_name && <p className="mt-1 text-xs opacity-80">{period.teacher_first_name} {period.teacher_last_name}</p>}
                                  {period.room_number && <Badge variant="outline" className="mt-1 w-fit text-[10px] h-4 px-1">{period.room_number}</Badge>}
                                </div>
                              ))
                            ) : (
                              <div className="h-full rounded-lg border border-dashed flex items-center justify-center text-muted-foreground/30 text-[10px]">Free</div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
