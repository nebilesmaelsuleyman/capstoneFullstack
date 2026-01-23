"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, CheckCircle2, XCircle, Clock, AlertCircle, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Class {
  id: number
  class_name: string
  class_code: string
  section: string
  grade_level: number
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

  useEffect(() => {
    fetchClasses()
  }, [])

  useEffect(() => {
    if (selectedClass && selectedDate) {
      fetchClassAttendance()
    }
  }, [selectedClass, selectedDate])

  const fetchClasses = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/classes', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (res.ok) {
        const data = await res.json()
        setClasses(data)
      }
    } catch (error) {
      console.error('Error fetching classes:', error)
      toast({
        title: "Error",
        description: "Failed to fetch classes",
        variant: "destructive"
      })
    }
  }

  const fetchClassAttendance = async () => {
    setLoading(true)
    try {
      const res = await fetch(
        `http://localhost:4000/api/attendance/class/${selectedClass}?date=${selectedDate}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      )
      if (res.ok) {
        const data = await res.json()
        setStudents(data.data || data)
        calculateStats(data.data || data)
      }
    } catch (error) {
      console.error('Error fetching attendance:', error)
      toast({
        title: "Error",
        description: "Failed to fetch attendance data",
        variant: "destructive"
      })
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
    setStudents(prev => prev.map(s =>
      s.student_id === studentId ? { ...s, status } : s
    ))
    calculateStats(students.map(s =>
      s.student_id === studentId ? { ...s, status } : s
    ))
  }

  const handleSaveAttendance = async () => {
    if (!selectedClass || !selectedDate) {
      toast({
        title: "Error",
        description: "Please select a class and date",
        variant: "destructive"
      })
      return
    }

    setSaving(true)
    try {
      const records = students
        .filter(s => s.status !== 'not_marked')
        .map(s => ({
          studentId: s.student_id,
          status: s.status,
          remarks: s.remarks || null
        }))

      const res = await fetch('http://localhost:4000/api/attendance/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          classId: parseInt(selectedClass),
          date: selectedDate,
          records
        })
      })

      if (res.ok) {
        toast({
          title: "Success",
          description: "Attendance saved successfully",
        })
        fetchClassAttendance()
      } else {
        throw new Error('Failed to save attendance')
      }
    } catch (error) {
      console.error('Error saving attendance:', error)
      toast({
        title: "Error",
        description: "Failed to save attendance",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "present":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      case "absent":
        return <XCircle className="h-5 w-5 text-red-500" />
      case "late":
        return <Clock className="h-5 w-5 text-yellow-500" />
      case "excused":
        return <AlertCircle className="h-5 w-5 text-blue-500" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: any = {
      present: "default",
      absent: "destructive",
      late: "secondary",
      excused: "outline",
      not_marked: "outline"
    }
    return (
      <Badge variant={variants[status]} className="capitalize">
        {status === 'not_marked' ? 'Not Marked' : status}
      </Badge>
    )
  }

  return (
    <div className="flex flex-col gap-8 p-8">
      <div>
        <h1 className="font-semibold text-3xl text-balance">Attendance Management</h1>
        <p className="text-muted-foreground">Mark and track student attendance</p>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Present</p>
                <p className="font-bold text-2xl">{stats.present}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Absent</p>
                <p className="font-bold text-2xl">{stats.absent}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Late</p>
                <p className="font-bold text-2xl">{stats.late}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Attendance Rate</p>
                <p className="font-bold text-2xl">{stats.percentage.toFixed(1)}%</p>
              </div>
              <CalendarIcon className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Mark Attendance</CardTitle>
          <CardDescription>Select class and date to mark attendance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-4">
            <div className="flex-1 space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
            <div className="flex-1 space-y-2">
              <Label htmlFor="class">Class</Label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger id="class">
                  <SelectValue placeholder="Select a class" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id.toString()}>
                      {cls.class_name} - {cls.section}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : students.length > 0 ? (
            <>
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Roll Number</TableHead>
                      <TableHead>Student Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((student) => (
                      <TableRow key={student.student_id}>
                        <TableCell className="font-medium">{student.roll_number}</TableCell>
                        <TableCell>{student.first_name} {student.last_name}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(student.status)}
                            {getStatusBadge(student.status)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant={student.status === 'present' ? 'default' : 'outline'}
                              onClick={() => updateStudentStatus(student.student_id, 'present')}
                            >
                              Present
                            </Button>
                            <Button
                              size="sm"
                              variant={student.status === 'absent' ? 'destructive' : 'outline'}
                              onClick={() => updateStudentStatus(student.student_id, 'absent')}
                            >
                              Absent
                            </Button>
                            <Button
                              size="sm"
                              variant={student.status === 'late' ? 'secondary' : 'outline'}
                              onClick={() => updateStudentStatus(student.student_id, 'late')}
                            >
                              Late
                            </Button>
                            <Button
                              size="sm"
                              variant={student.status === 'excused' ? 'outline' : 'outline'}
                              onClick={() => updateStudentStatus(student.student_id, 'excused')}
                            >
                              Excused
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveAttendance} disabled={saving}>
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Attendance
                </Button>
              </div>
            </>
          ) : selectedClass ? (
            <div className="py-12 text-center text-muted-foreground">
              No students found in this class
            </div>
          ) : (
            <div className="py-12 text-center text-muted-foreground">
              Please select a class to view students
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
