"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, CheckCircle2, XCircle, Clock, AlertCircle, Loader2, ClipboardCheck, Users, Search, Download } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface Class {
  id: number
  class_name: string
  class_code: string
  section: string
  grade_level: number
}

interface Subject {
  id: number
  subject_name: string
  subject_code: string
}

interface Student {
  student_id: number
  first_name: string
  last_name: string
  roll_number: string
  status: string
  remarks?: string
}

export default function AttendancePage() {
  const { toast } = useToast()
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [selectedClass, setSelectedClass] = useState<string>("")
  const [classes, setClasses] = useState<Class[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [selectedSubject, setSelectedSubject] = useState<string>("")
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [stats, setStats] = useState({
    present: 0,
    absent: 0,
    late: 0,
    excused: 0,
    total: 0,
    percentage: 0
  })
  const [historyOpen, setHistoryOpen] = useState(false)
  const [selectedStudentHistory, setSelectedStudentHistory] = useState<any[]>([])
  const [historyLoading, setHistoryLoading] = useState(false)
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null)

  useEffect(() => {
    fetchClasses()
    fetchSubjects()
  }, [])

  useEffect(() => {
    if (selectedClass && selectedDate) {
      fetchClassAttendance()
    }
  }, [selectedClass, selectedDate, selectedSubject]) // Refetch when subject changes

  const fetchClasses = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/classes', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      })
      if (res.ok) {
        const data = await res.json()
        setClasses(data)
      }
    } catch (error) {
      console.error('Error fetching classes:', error)
    }
  }

  const fetchSubjects = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/subjects', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      })
      if (res.ok) {
        const data = await res.json()
        setSubjects(data)
      }
    } catch (error) {
      console.error('Error fetching subjects:', error)
    }
  }

  const fetchClassAttendance = async () => {
    setLoading(true)
    try {
      let url = `http://localhost:4000/api/attendance/class/${selectedClass}?date=${selectedDate}`
      if (selectedSubject && selectedSubject !== 'all') url += `&subjectId=${selectedSubject}`

      const res = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      })
      if (res.ok) {
        const data = await res.json()
        setStudents(data.data || data)
        calculateStats(data.data || data)
      }
    } catch (error) {
      console.error('Error fetching attendance:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (studentList: Student[]) => {
    const present = studentList.filter(s => s.status === 'present').length
    const absent = studentList.filter(s => s.status === 'absent').length
    const late = studentList.filter(s => s.status === 'late').length
    const excused = studentList.filter(s => s.status === 'excused').length
    const total = studentList.length
    const percentage = total > 0 ? (present / total) * 100 : 0

    setStats({ present, absent, late, excused, total, percentage })
  }

  const updateStudentStatus = (studentId: number, status: string) => {
    setStudents(prev => {
      const updated = prev.map(s => s.student_id === studentId ? { ...s, status } : s);
      calculateStats(updated);
      return updated;
    })
  }

  const handleSaveAttendance = async () => {
    if (!selectedClass || !selectedDate) return
    setSaving(true)
    try {
      const records = students
        .filter(s => s.status !== 'not_marked')
        .map(s => ({
          studentId: s.student_id,
          status: s.status,
          remarks: s.remarks || null,
          subjectId: selectedSubject && selectedSubject !== 'all' ? parseInt(selectedSubject) : null
        }))

      const res = await fetch('http://localhost:4000/api/attendance/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({
          classId: parseInt(selectedClass),
          date: selectedDate,
          records
        })
      })

      if (res.ok) {
        toast({ title: "Success", description: "Attendance protocols synchronized" })
        fetchClassAttendance()
      }
    } catch (error) {
      console.error('Error saving attendance:', error)
    } finally {
      setSaving(false)
    }
  }

  const fetchStudentHistory = async (student: Student) => {
    setViewingStudent(student)
    setHistoryLoading(true)
    setHistoryOpen(true)
    try {
      const res = await fetch(`http://localhost:4000/api/attendance/student/${student.student_id}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
      })
      if (res.ok) {
        const data = await res.json()
        setSelectedStudentHistory(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching student history:', error)
    } finally {
      setHistoryLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-8 p-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-indigo-400 text-sm font-bold uppercase tracking-widest">
            <ClipboardCheck className="h-4 w-4" />
            <span>Operational Continuity</span>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter">Attendance Registry</h1>
          <p className="text-slate-400 max-w-md">Monitor institutional presence, verify personnel location, and maintain daily activity logs.</p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" className="bg-slate-900/50 border-slate-800 text-slate-300 hover:text-white">
            <Download className="mr-2 h-4 w-4" /> Export Logs
          </Button>
          <Button onClick={handleSaveAttendance} disabled={saving || !selectedClass} className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20">
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
            Synchronize Records
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        {[
          { label: "Present Today", value: stats.present, icon: CheckCircle2, color: "emerald" },
          { label: "Absent Logs", value: stats.absent, icon: XCircle, color: "rose" },
          { label: "Delayed Entry", value: stats.late, icon: Clock, color: "yellow" },
          { label: "Retention Rate", value: `${stats.percentage.toFixed(1)}%`, icon: CalendarIcon, color: "indigo" }
        ].map((stat, i) => (
          <Card key={i} className="group relative overflow-hidden border-slate-800 bg-slate-900/40 backdrop-blur-md transition-all hover:bg-slate-900/60 border-0 shadow-xl">
            <div className={cn("absolute -right-2 -top-2 h-16 w-16 rounded-full opacity-5 blur-xl transition-opacity group-hover:opacity-20", `bg-${stat.color}-500`)}></div>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">{stat.label}</p>
                  <p className="font-black text-3xl text-white tracking-tighter mt-1">{stat.value}</p>
                </div>
                <div className={cn("p-3 rounded-2xl border bg-slate-950/50",
                  stat.color === "emerald" ? "text-emerald-400 border-emerald-500/20" :
                    stat.color === "rose" ? "text-rose-400 border-rose-500/20" :
                      stat.color === "yellow" ? "text-yellow-400 border-yellow-500/20" :
                        "text-indigo-400 border-indigo-500/20")}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-col md:flex-row items-end gap-6 bg-slate-950/40 p-6 rounded-3xl border border-slate-800 backdrop-blur-sm shadow-2xl">
        <div className="flex-1 space-y-3">
          <Label className="text-slate-400 text-xs font-bold uppercase tracking-widest">Temporal Reference</Label>
          <div className="relative group">
            <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
            <Input
              type="date"
              className="bg-slate-900 border-slate-700 pl-11 h-12 rounded-xl focus:ring-indigo-500/20"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
        </div>
        <div className="flex-1 space-y-3">
          <Label className="text-slate-400 text-xs font-bold uppercase tracking-widest">Target Class Unit</Label>
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger className="bg-slate-900 border-slate-700 h-12 rounded-xl focus:ring-indigo-500/20">
              <SelectValue placeholder="Select target unit" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-800 text-white">
              {classes.map((cls) => (
                <SelectItem key={cls.id} value={cls.id.toString()}>
                  {cls.class_name} - Section {cls.section} (Grade {cls.grade_level})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1 space-y-3">
          <Label className="text-slate-400 text-xs font-bold uppercase tracking-widest">Filter By Subject (Optional)</Label>
          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger className="bg-slate-900 border-slate-700 h-12 rounded-xl focus:ring-indigo-500/20">
              <SelectValue placeholder="All Subjects" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-800 text-white">
              <SelectItem value="all">All Subjects</SelectItem>
              {subjects.map((sub) => (
                <SelectItem key={sub.id} value={sub.id.toString()}>
                  {sub.subject_name} ({sub.subject_code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button variant="ghost" className="h-12 px-6 rounded-xl border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800">
          <Search className="mr-2 h-4 w-4" /> Filter Personnel
        </Button>
      </div>

      <Card className="bg-slate-900/40 border-slate-800 shadow-2xl overflow-hidden rounded-3xl backdrop-blur-xl">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 space-y-4">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-r-transparent"></div>
              <p className="text-slate-500 font-bold animate-pulse tracking-widest text-[10px] uppercase">Retrieving Presence Data...</p>
            </div>
          ) : students.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-950/50">
                  <TableRow className="border-slate-800 hover:bg-transparent">
                    <TableHead className="text-slate-400 font-bold uppercase text-[10px] tracking-widest pl-8 py-5">Personnel Identification</TableHead>
                    <TableHead className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Presence Status</TableHead>
                    <TableHead className="text-right text-slate-400 font-bold uppercase text-[10px] tracking-widest pr-8">Status Modification</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student) => (
                    <TableRow key={student.student_id} className="border-slate-800 hover:bg-slate-800/30 transition-colors group">
                      <TableCell className="pl-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-950 border border-slate-700 flex items-center justify-center text-indigo-400 font-black text-sm shadow-xl transition-transform group-hover:scale-110">
                            {student.first_name[0]}{student.last_name[0]}
                          </div>
                          <div className="flex flex-col">
                            <span
                              className="font-bold text-white group-hover:text-indigo-400 transition-colors uppercase tracking-tighter cursor-pointer"
                              onClick={() => fetchStudentHistory(student)}
                            >
                              {student.first_name} {student.last_name}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1.5 mt-1">
                              <Users className="h-3 w-3" />
                              ID: {student.roll_number}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className={cn("h-1.5 w-1.5 rounded-full",
                            student.status === 'present' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' :
                              student.status === 'absent' ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]' :
                                student.status === 'late' ? 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.5)]' :
                                  'bg-slate-500')}></div>
                          <Badge className={cn("px-3 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest",
                            student.status === 'present' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                              student.status === 'absent' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                                student.status === 'late' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                                  'bg-slate-800 text-slate-400 border-slate-700')}>
                            {student.status || 'not initialized'}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="pr-8 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {[
                            { id: 'present', label: 'Present', color: 'emerald' },
                            { id: 'absent', label: 'Absent', color: 'rose' },
                            { id: 'late', label: 'Late', color: 'yellow' }
                          ].map((act) => (
                            <Button
                              key={act.id}
                              size="sm"
                              className={cn("h-9 rounded-xl font-bold text-[10px] uppercase px-4 transition-all duration-300",
                                student.status === act.id
                                  ? `bg-${act.color}-600 text-white shadow-lg`
                                  : `bg-slate-900 text-slate-500 hover:bg-${act.color}-500/10 hover:text-${act.color}-400 border border-slate-800`
                              )}
                              onClick={() => updateStudentStatus(student.student_id, act.id)}
                            >
                              {act.label}
                            </Button>
                          ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : selectedClass ? (
            <div className="py-24 text-center space-y-4">
              <AlertCircle className="h-12 w-12 text-slate-700 mx-auto" />
              <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">No personnel detected in selected unit</p>
            </div>
          ) : (
            <div className="py-24 text-center space-y-4">
              <div className="h-12 w-12 rounded-full border-2 border-dashed border-slate-800 mx-auto flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-slate-800" />
              </div>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Awaiting terminal selection to initialize roster</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={historyOpen} onOpenChange={setHistoryOpen}>
        <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Attendance History: {viewingStudent?.first_name} {viewingStudent?.last_name}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {historyLoading ? (
              <div className="flex justify-center py-8"><Loader2 className="h-8 w-8 animate-spin text-indigo-500" /></div>
            ) : selectedStudentHistory.length === 0 ? (
              <p className="text-center text-slate-500 py-8">No attendance records found for this student.</p>
            ) : (
              <div className="max-h-[400px] overflow-y-auto space-y-2 pr-2">
                {selectedStudentHistory.map((record, i) => (
                  <div key={i} className="flex justify-between items-center p-3 rounded-xl border border-slate-800 bg-slate-900/50">
                    <div>
                      <div className="text-sm font-bold text-white uppercase tracking-tighter">{record.class_name}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{new Date(record.attendance_date).toLocaleDateString()}</div>
                    </div>
                    <Badge className={cn("px-2 py-0.5 rounded text-[10px] uppercase font-black tracking-widest",
                      record.status === 'present' ? 'bg-emerald-500/10 text-emerald-400' :
                        record.status === 'absent' ? 'bg-rose-500/10 text-rose-400' :
                          record.status === 'late' ? 'bg-yellow-500/10 text-yellow-400' :
                            'bg-slate-800 text-slate-400')}>
                      {record.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
