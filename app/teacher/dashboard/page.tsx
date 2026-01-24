"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { BookOpen, Calendar, GraduationCap, Plus, User, Users, Award, TrendingUp, Sparkles, Bell, Megaphone, Trophy, AlertCircle, Clock, Loader2, ClipboardCheck, Check, X } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { getCurrentUser, getUserId, getTeacherIdFromUserId, authenticatedFetch, logout } from "@/lib/auth-utils"

interface Teacher {
    id: number
    firstName: string
    lastName: string
    email: string
    phone?: string
    employeeId: string
    department: string
    subjects: string
    qualification?: string
}

interface Class {
    id: number
    class_name: string
    class_code: string
    grade_level: number
    section: string
    room_number: string
    student_count: number
}

interface Student {
    id: number
    student_id: string
    firstName: string
    lastName: string
    email: string
    gradeLevel: number
}

interface Grade {
    id: number
    student_id: number
    exam_type: string
    grade: number
    max_grade: number
    exam_date: string
    remarks?: string
    student_number: string
    first_name: string
    last_name: string
    email: string
}

interface Announcement {
    id: number
    title: string
    content: string
    announcement_type: string
    target_audience: string
    posted_by_first_name?: string
    posted_by_last_name?: string
    posted_at: string
    priority: string
}

interface TimetableEntry {
    id: number
    day_of_week: string
    start_time: string
    end_time: string
    room_number: string
    subject_name: string
    class_name: string
    section: string
}

export default function TeacherDashboard() {
    const [teacher, setTeacher] = useState<Teacher | null>(null)
    const [classes, setClasses] = useState<Class[]>([])
    const [students, setStudents] = useState<Student[]>([])
    const [selectedClass, setSelectedClass] = useState<Class | null>(null)
    const [selectedSubject, setSelectedSubject] = useState<string>("")
    const [grades, setGrades] = useState<Grade[]>([])
    const [announcements, setAnnouncements] = useState<Announcement[]>([])
    const [timetable, setTimetable] = useState<TimetableEntry[]>([])
    const [loading, setLoading] = useState(true)
    const [teacherId, setTeacherId] = useState<number | null>(null)
    const [isGradeDialogOpen, setIsGradeDialogOpen] = useState(false)
    const [newGrade, setNewGrade] = useState({
        student_id: "",
        subject_id: "",
        class_id: "",
        exam_type: "",
        grade: "",
        max_grade: "100",
        exam_date: new Date().toISOString().split('T')[0],
        remarks: ""
    })
    const [activeSection, setActiveSection] = useState("announcements")
    const [allSubjects, setAllSubjects] = useState<any[]>([])
    const [isAttendanceDialogOpen, setIsAttendanceDialogOpen] = useState(false)
    const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0])
    const [classAttendance, setClassAttendance] = useState<any[]>([])
    const [savingAttendance, setSavingAttendance] = useState(false)
    const [editingGradeId, setEditingGradeId] = useState<number | null>(null)
    const [markingStudentId, setMarkingStudentId] = useState<number | null>(null)
    const [isEnrollDialogOpen, setIsEnrollDialogOpen] = useState(false)
    const [allStudents, setAllStudents] = useState<Student[]>([])
    const [enrollingStudentId, setEnrollingStudentId] = useState<string>("")
    const [enrollingLoading, setEnrollingLoading] = useState(false)

    useEffect(() => {
        const handleNav = (e: any) => setActiveSection(e.detail)
        window.addEventListener("teacher-dashboard-nav", handleNav)
        return () => window.removeEventListener("teacher-dashboard-nav", handleNav)
    }, [])

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const res = await fetch('http://localhost:4000/api/subjects', {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
                })
                if (res.ok) {
                    const data = await res.json()
                    setAllSubjects(data.data || data)
                }
            } catch (error) {
                console.error('Error fetching subjects:', error)
            }
        }
        const fetchAllStudents = async () => {
            try {
                const res = await fetch('http://localhost:4000/api/students', {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
                })
                if (res.ok) {
                    const data = await res.json()
                    setAllStudents(data.data || data)
                }
            } catch (error) {
                console.error('Error fetching all students:', error)
            }
        }
        fetchSubjects()
        fetchAllStudents()
    }, [])

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

    useEffect(() => {
        const fetchId = async () => {
            const userId = getUserId()
            if (userId) {
                const tId = await getTeacherIdFromUserId(userId)
                if (tId) {
                    setTeacherId(tId)
                    fetchTeacherData(tId)
                } else {
                    console.error("Could not find teacher profile for user", userId)
                    setLoading(false)
                }
            } else {
                setLoading(false)
            }
        }
        fetchId()
    }, [])

    const fetchTeacherData = async (id: number) => {
        setLoading(true)
        try {
            const [teacherRes, classesRes, announcementsRes, timetableRes] = await Promise.all([
                fetch(`http://localhost:4000/api/teachers/${id}`, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
                }),
                fetch(`http://localhost:4000/api/classes/teacher/${id}`, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
                }),
                fetch(`http://localhost:4000/api/announcements?audience=teachers`, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
                }),
                fetch(`http://localhost:4000/api/timetable/teacher/${id}`, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
                })
            ])

            if (teacherRes.ok) setTeacher(await teacherRes.json())
            if (classesRes.ok) setClasses(await classesRes.json())
            if (announcementsRes.ok) {
                const data = await announcementsRes.json()
                setAnnouncements(data.data)
            }
            if (timetableRes.ok) {
                const data = await timetableRes.json()
                setTimetable(data.data)
            }
        } catch (error) {
            console.error('Error fetching teacher data:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = () => {
        logout()
    }

    const fetchStudentsByClass = async (classId: number) => {
        try {
            const res = await fetch(`http://localhost:4000/api/students/by-class/${classId}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
            })
            if (res.ok) setStudents(await res.json())
        } catch (error) {
            console.error('Error fetching students:', error)
        }
    }

    const fetchGradesForClass = async (classId: number, subjectId: string) => {
        try {
            const res = await fetch(`http://localhost:4000/api/grades/class/${classId}/subject/${subjectId}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
            })
            if (res.ok) {
                const data = await res.json()
                setGrades(data.data || data)
            }
        } catch (error) {
            console.error('Error fetching grades:', error)
        }
    }

    const handleCreateGrade = async () => {
        try {
            const url = editingGradeId
                ? `http://localhost:4000/api/grades/${editingGradeId}`
                : 'http://localhost:4000/api/grades';

            const method = editingGradeId ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                },
                body: JSON.stringify({
                    student_id: parseInt(newGrade.student_id),
                    subject_id: parseInt(newGrade.subject_id),
                    class_id: parseInt(newGrade.class_id),
                    exam_type: newGrade.exam_type,
                    grade: parseFloat(newGrade.grade),
                    max_grade: parseFloat(newGrade.max_grade),
                    exam_date: newGrade.exam_date,
                    remarks: newGrade.remarks
                })
            })

            if (res.ok) {
                setIsGradeDialogOpen(false)
                setEditingGradeId(null)
                setNewGrade({
                    student_id: "",
                    subject_id: "",
                    class_id: "",
                    exam_type: "",
                    grade: "",
                    max_grade: "100",
                    exam_date: new Date().toISOString().split('T')[0],
                    remarks: ""
                })
                if (selectedClass && selectedSubject) {
                    fetchGradesForClass(selectedClass.id, selectedSubject)
                }
            }
        } catch (error) {
            console.error('Error saving grade:', error)
        }
    }

    const handleEditGrade = (grade: Grade) => {
        setEditingGradeId(grade.id)
        setNewGrade({
            student_id: grade.student_id.toString(),
            subject_id: selectedSubject,
            class_id: selectedClass?.id.toString() || "",
            exam_type: grade.exam_type,
            grade: grade.grade.toString(),
            max_grade: grade.max_grade.toString(),
            exam_date: new Date(grade.exam_date).toISOString().split('T')[0],
            remarks: grade.remarks || ""
        })
        fetchStudentsByClass(selectedClass?.id || 0)
        setIsGradeDialogOpen(true)
    }

    const fetchClassAttendance = async (classId: number, date: string) => {
        try {
            const res = await fetch(`http://localhost:4000/api/attendance/class/${classId}?date=${date}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
            })
            if (res.ok) {
                const data = await res.json()
                setClassAttendance(data.data || data)
            }
        } catch (error) {
            console.error('Error fetching attendance:', error)
        }
    }

    const handleMarkAttendance = async (studentId: number, status: string) => {
        if (!selectedClass) return
        setMarkingStudentId(studentId)
        try {
            const res = await fetch('http://localhost:4000/api/attendance', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                },
                body: JSON.stringify({
                    studentId,
                    classId: selectedClass.id,
                    attendanceDate,
                    status,
                    remarks: ""
                })
            })
            if (res.ok) {
                setClassAttendance(classAttendance.map(s =>
                    s.student_id === studentId ? { ...s, status } : s
                ))
            }
        } catch (error) {
            console.error('Error marking attendance:', error)
        } finally {
            setMarkingStudentId(null)
        }
    }

    const handleSaveAttendance = async () => {
        if (!selectedClass) return
        setSavingAttendance(true)
        try {
            const records = classAttendance.map(s => ({
                studentId: s.student_id,
                status: s.status === 'not_marked' ? 'present' : s.status,
                remarks: s.remarks
            }))

            const res = await fetch(`http://localhost:4000/api/attendance/bulk/${selectedClass.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                },
                body: JSON.stringify({
                    date: attendanceDate,
                    records
                })
            })

            if (res.ok) {
                fetchClassAttendance(selectedClass.id, attendanceDate)
            }
        } catch (error) {
            console.error('Error saving attendance:', error)
        } finally {
            setSavingAttendance(false)
        }
    }

    const handleEnrollStudent = async () => {
        if (!selectedClass || !enrollingStudentId) return
        setEnrollingLoading(true)
        try {
            const res = await fetch(`http://localhost:4000/api/classes/${selectedClass.id}/enroll/${enrollingStudentId}`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
            })
            if (res.ok) {
                setIsEnrollDialogOpen(false)
                setEnrollingStudentId("")
                fetchTeacherData(teacherId!) // Refresh student counts
                fetchStudentsByClass(selectedClass.id)
            }
        } catch (error) {
            console.error('Error enrolling student:', error)
        } finally {
            setEnrollingLoading(false)
        }
    }

    const handleClassSelect = (classItem: Class) => {
        setSelectedClass(classItem)
        setGrades([])
        setSelectedSubject("")
        setNewGrade({ ...newGrade, class_id: classItem.id.toString() })
        fetchStudentsByClass(classItem.id)
    }

    const getAnnouncementIcon = (type: string) => {
        switch (type) {
            case "general": return <Bell className="h-5 w-5" />
            case "academic": return <AlertCircle className="h-5 w-5" />
            case "event": return <Trophy className="h-5 w-5" />
            case "holiday": return <Calendar className="h-5 w-5" />
            default: return <Megaphone className="h-5 w-5" />
        }
    }

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
                <Loader2 className="h-12 w-12 animate-spin text-purple-500" />
            </div>
        )
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {activeSection === "announcements" && (
                <>
                    <div className="grid gap-4 md:grid-cols-4">
                        <Card className="border-0 bg-purple-500/10 backdrop-blur-xl shadow-xl hover:scale-105 transition-transform"><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium text-purple-300">Total Classes</CardTitle><BookOpen className="h-5 w-5 text-purple-400" /></CardHeader><CardContent><div className="text-3xl font-bold text-white">{classes.length}</div><p className="text-xs text-purple-300">Active teaching units</p></CardContent></Card>
                        <Card className="border-0 bg-blue-500/10 backdrop-blur-xl shadow-xl hover:scale-105 transition-transform"><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium text-blue-300">Total Students</CardTitle><Users className="h-5 w-5 text-blue-400" /></CardHeader><CardContent><div className="text-3xl font-bold text-white">{classes.reduce((sum, c) => sum + (parseInt(c.student_count?.toString() || '0')), 0)}</div><p className="text-xs text-blue-300">In all sections</p></CardContent></Card>
                        <Card className="border-0 bg-cyan-500/10 backdrop-blur-xl shadow-xl hover:scale-105 transition-transform"><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium text-cyan-300">Announcements</CardTitle><Megaphone className="h-5 w-5 text-cyan-400" /></CardHeader><CardContent><div className="text-3xl font-bold text-white">{announcements.length}</div><p className="text-xs text-cyan-300">Latest school updates</p></CardContent></Card>
                        <Card className="border-0 bg-pink-500/10 backdrop-blur-xl shadow-xl hover:scale-105 transition-transform"><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium text-pink-300">Teaching Hours</CardTitle><Clock className="h-5 w-5 text-pink-400" /></CardHeader><CardContent><div className="text-3xl font-bold text-white">{timetable.length}</div><p className="text-xs text-pink-300">Weekly sessions</p></CardContent></Card>
                    </div>

                    <Card className="border-0 bg-slate-800/50 backdrop-blur-xl shadow-xl">
                        <CardHeader><CardTitle className="text-white">Recent Announcements</CardTitle></CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {announcements.length === 0 ? (
                                    <div className="py-12 text-center text-slate-400">No new announcements</div>
                                ) : (
                                    announcements.map((a) => (
                                        <div key={a.id} className="p-4 rounded-xl border border-slate-700 bg-slate-800/30">
                                            <div className="flex items-start gap-4">
                                                <div className="p-2 rounded-full bg-blue-500/20 text-blue-400">{getAnnouncementIcon(a.announcement_type)}</div>
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-white">{a.title}</h3>
                                                    <p className="text-sm text-slate-400 mt-1">{a.content}</p>
                                                    <div className="mt-2 text-[10px] text-slate-500 flex gap-2">
                                                        <span>From: {a.posted_by_first_name} {a.posted_by_last_name}</span>
                                                        <span>•</span>
                                                        <span>{new Date(a.posted_at).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </>
            )}

            {activeSection === "timetable" && (
                <Card className="border-0 bg-slate-800/50 backdrop-blur-xl shadow-xl">
                    <CardHeader><CardTitle className="text-white">My Weekly Teaching Schedule</CardTitle></CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <div className="grid grid-cols-6 gap-2 min-w-[800px]">
                                <div className="space-y-2">
                                    <div className="h-10 flex items-center justify-center font-bold text-slate-400 text-xs tracking-tighter">TIME</div>
                                    {timeSlots.map((slot, i) => (
                                        <div key={i} className="h-24 flex flex-col items-center justify-center rounded-lg border border-slate-700 bg-slate-800/40 text-[10px] text-slate-400">
                                            <Clock className="h-3 w-3 mb-1" />
                                            <span>{slot.start}</span>
                                            <span>{slot.end}</span>
                                        </div>
                                    ))}
                                </div>
                                {days.map((day) => (
                                    <div key={day} className="space-y-2">
                                        <div className="h-10 flex items-center justify-center font-bold text-purple-400 text-xs uppercase">{day}</div>
                                        {timeSlots.map((slot, i) => {
                                            const entry = timetable.find(e => e.day_of_week === day && e.start_time.startsWith(slot.start))
                                            return (
                                                <div key={i} className="h-24 rounded-lg border border-slate-700 bg-slate-800/20 p-2 overflow-hidden flex flex-col justify-center">
                                                    {entry ? (
                                                        <>
                                                            <p className="font-bold text-[11px] text-white leading-tight">{entry.subject_name}</p>
                                                            <p className="text-[10px] text-purple-300 mt-0.5">{entry.class_name} - {entry.section}</p>
                                                            <Badge variant="outline" className="text-[9px] h-3 px-1 mt-1 border-slate-600 text-slate-400">RM {entry.room_number}</Badge>
                                                        </>
                                                    ) : (
                                                        <div className="text-[9px] text-slate-800 text-center">No class</div>
                                                    )}
                                                </div>
                                            )
                                        })}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {activeSection === "classes" && (
                <Card className="border-0 bg-slate-800/50 backdrop-blur-xl shadow-xl">
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle className="text-white">Assigned Classes</CardTitle>
                            <Dialog open={isEnrollDialogOpen} onOpenChange={setIsEnrollDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={() => setSelectedClass(null)}>
                                        <Plus className="mr-2 h-4 w-4" /> Enroll Student
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="bg-slate-900 text-white border-slate-700">
                                    <DialogHeader><DialogTitle>Enroll Student to Class</DialogTitle></DialogHeader>
                                    <div className="space-y-4 py-4">
                                        <div className="grid gap-2">
                                            <Label>Class</Label>
                                            <Select value={selectedClass?.id.toString()} onValueChange={v => setSelectedClass(classes.find(c => c.id.toString() === v)!)}>
                                                <SelectTrigger className="bg-slate-800"><SelectValue placeholder="Select Class" /></SelectTrigger>
                                                <SelectContent className="bg-slate-800">{classes.map(c => <SelectItem key={c.id} value={c.id.toString()}>{c.class_name}</SelectItem>)}</SelectContent>
                                            </Select>
                                        </div>
                                        <div className="grid gap-2">
                                            <Label>Student</Label>
                                            <Select value={enrollingStudentId} onValueChange={setEnrollingStudentId}>
                                                <SelectTrigger className="bg-slate-800"><SelectValue placeholder="Select Student" /></SelectTrigger>
                                                <SelectContent className="bg-slate-800">
                                                    {allStudents
                                                        .filter(s => !students.some(es => es.id === s.id))
                                                        .map(s => <SelectItem key={s.id} value={s.id.toString()}>{s.firstName} {s.lastName}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button onClick={handleEnrollStudent} disabled={enrollingLoading || !selectedClass || !enrollingStudentId}>
                                            {enrollingLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                                            Enroll Now
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-3">
                            {classes.map((c) => (
                                <Card key={c.id} className="border-0 bg-slate-700/50 p-4 hover:shadow-lg transition-all">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-bold text-white mb-1">{c.class_name}</h3>
                                            <div className="text-xs text-slate-400">{c.class_code} • {c.student_count} Students</div>
                                        </div>
                                        <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">Grade {c.grade_level}</Badge>
                                    </div>
                                    <div className="mt-4 flex justify-between items-center text-[10px] text-slate-300">
                                        <span>Room: {c.room_number}</span>
                                        <Button variant="ghost" size="sm" className="h-6 px-2 text-[9px]" onClick={() => { setSelectedClass(c); fetchStudentsByClass(c.id); setActiveSection("grades") }}>Manage Grades</Button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {activeSection === "grades" && (
                <Card className="border-0 bg-slate-800/50 backdrop-blur-xl shadow-xl">
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle className="text-white">Student Grading</CardTitle>
                            <Dialog open={isGradeDialogOpen} onOpenChange={(open) => { setIsGradeDialogOpen(open); if (!open) { setEditingGradeId(null); setNewGrade({ ...newGrade, student_id: "" }); } }}>
                                <DialogTrigger asChild><Button size="sm" className="bg-purple-600 hover:bg-purple-700" onClick={() => { setEditingGradeId(null); setNewGrade({ ...newGrade, student_id: "" }); }}><Plus className="mr-2 h-4 w-4" />New Grade</Button></DialogTrigger>
                                <DialogContent className="bg-slate-900 text-white border-slate-700">
                                    <DialogHeader><DialogTitle>{editingGradeId ? 'Edit Grade' : 'Add New Grade'}</DialogTitle></DialogHeader>
                                    <div className="space-y-4 py-4">
                                        <div className="grid gap-2"><Label>Class</Label><Select value={newGrade.class_id} onValueChange={val => { setNewGrade({ ...newGrade, class_id: val }); fetchStudentsByClass(parseInt(val)); }}><SelectTrigger className="bg-slate-800"><SelectValue /></SelectTrigger><SelectContent className="bg-slate-800">{classes.map(c => <SelectItem key={c.id} value={c.id.toString()}>{c.class_name}</SelectItem>)}</SelectContent></Select></div>
                                        <div className="grid gap-2"><Label>Student</Label><Select value={newGrade.student_id} onValueChange={val => setNewGrade({ ...newGrade, student_id: val })}><SelectTrigger className="bg-slate-800"><SelectValue /></SelectTrigger><SelectContent className="bg-slate-800">{students.map(s => <SelectItem key={s.id} value={s.id.toString()}>{s.firstName} {s.lastName}</SelectItem>)}</SelectContent></Select></div>
                                        <div className="grid gap-2"><Label>Subject</Label><Select value={newGrade.subject_id} onValueChange={val => setNewGrade({ ...newGrade, subject_id: val })}><SelectTrigger className="bg-slate-800"><SelectValue placeholder="Select Subject" /></SelectTrigger><SelectContent className="bg-slate-800">{allSubjects.map(s => <SelectItem key={s.id} value={s.id.toString()}>{s.subject_name}</SelectItem>)}</SelectContent></Select></div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="grid gap-2"><Label>Exam Type</Label><Select value={newGrade.exam_type} onValueChange={val => setNewGrade({ ...newGrade, exam_type: val })}><SelectTrigger className="bg-slate-800"><SelectValue placeholder="Select Type" /></SelectTrigger><SelectContent className="bg-slate-800"><SelectItem value="midterm">Midterm</SelectItem><SelectItem value="final">Final</SelectItem><SelectItem value="quiz">Quiz</SelectItem><SelectItem value="assignment">Assignment</SelectItem></SelectContent></Select></div>
                                            <div className="grid gap-2"><Label>Exam Date</Label><Input type="date" value={newGrade.exam_date} onChange={e => setNewGrade({ ...newGrade, exam_date: e.target.value })} className="bg-slate-800" /></div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="grid gap-2"><Label>Grade</Label><Input type="number" value={newGrade.grade} onChange={e => setNewGrade({ ...newGrade, grade: e.target.value })} className="bg-slate-800" /></div>
                                            <div className="grid gap-2"><Label>Max</Label><Input type="number" value={newGrade.max_grade} onChange={e => setNewGrade({ ...newGrade, max_grade: e.target.value })} className="bg-slate-800" /></div>
                                        </div>
                                        <div className="grid gap-2"><Label>Remarks</Label><Input value={newGrade.remarks} onChange={e => setNewGrade({ ...newGrade, remarks: e.target.value })} className="bg-slate-800" placeholder="Optional remarks" /></div>
                                    </div>
                                    <DialogFooter><Button onClick={handleCreateGrade}>Save Grade</Button></DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <Select value={selectedClass?.id.toString() || ""} onValueChange={v => handleClassSelect(classes.find(c => c.id.toString() === v)!)}>
                                    <SelectTrigger className="bg-slate-800 border-slate-700"><SelectValue placeholder="Select Class" /></SelectTrigger>
                                    <SelectContent className="bg-slate-800">{classes.map(c => <SelectItem key={c.id} value={c.id.toString()}>{c.class_name}</SelectItem>)}</SelectContent>
                                </Select>
                                <Select value={selectedSubject} onValueChange={v => { setSelectedSubject(v); if (selectedClass) fetchGradesForClass(selectedClass.id, v); }}>
                                    <SelectTrigger className="bg-slate-800 border-slate-700"><SelectValue placeholder="Select Subject" /></SelectTrigger>
                                    <SelectContent className="bg-slate-800">{allSubjects.map(s => <SelectItem key={s.id.toString()} value={s.id.toString()}>{s.subject_name}</SelectItem>)}</SelectContent>
                                </Select>
                            </div>

                            <div className="rounded-xl border border-slate-700 overflow-hidden">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-900/50 text-slate-400 text-xs font-medium uppercase">
                                        <tr>
                                            <th className="px-6 py-4">Student</th>
                                            <th className="px-6 py-4">Grade / Max</th>
                                            <th className="px-6 py-4">Type</th>
                                            <th className="px-6 py-4">Date</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-700">
                                        {!selectedClass ? (
                                            <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-500">Select a class to view student grades</td></tr>
                                        ) : students.length === 0 ? (
                                            <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-500">No students enrolled in this class</td></tr>
                                        ) : students.map(student => {
                                            const studentGrade = grades.find(g => g.student_id === student.id);
                                            return (
                                                <tr key={student.id} className="bg-slate-800/20 group">
                                                    <td className="px-6 py-4">
                                                        <div className="font-medium text-white">{student.firstName} {student.lastName}</div>
                                                        <div className="text-[10px] text-slate-500">{student.student_id}</div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {studentGrade ? (
                                                            <span className="font-bold text-purple-400">{studentGrade.grade} / {studentGrade.max_grade}</span>
                                                        ) : (
                                                            <span className="text-slate-600 italic text-sm">Not Graded</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <Badge variant="outline" className="capitalize text-[10px] border-slate-700 text-slate-400">
                                                            {studentGrade?.exam_type || "—"}
                                                        </Badge>
                                                    </td>
                                                    <td className="px-6 py-4 text-xs text-slate-500">
                                                        {studentGrade ? new Date(studentGrade.exam_date).toLocaleDateString() : "—"}
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        {studentGrade ? (
                                                            <Button variant="ghost" size="sm" onClick={() => handleEditGrade(studentGrade)} className="h-8 w-8 p-0 text-slate-400 hover:text-white hover:bg-slate-700">
                                                                <Award className="h-4 w-4" />
                                                            </Button>
                                                        ) : (
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => {
                                                                    setNewGrade({
                                                                        ...newGrade,
                                                                        student_id: student.id.toString(),
                                                                        class_id: selectedClass.id.toString(),
                                                                        subject_id: selectedSubject
                                                                    });
                                                                    setIsGradeDialogOpen(true);
                                                                }}
                                                                className="h-8 px-2 text-[10px] text-purple-400 hover:text-purple-300 hover:bg-purple-500/10"
                                                                disabled={!selectedSubject}
                                                            >
                                                                <Plus className="mr-1 h-3 w-3" /> Add Grade
                                                            </Button>
                                                        )}
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {activeSection === "attendance" && (
                <Card className="border-0 bg-slate-800/50 backdrop-blur-xl shadow-xl">
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle className="text-white flex items-center gap-2">
                                <ClipboardCheck className="h-6 w-6 text-green-400" />
                                Student Attendance
                            </CardTitle>
                            <div className="flex gap-4 items-center">
                                <Input
                                    type="date"
                                    value={attendanceDate}
                                    onChange={(e) => {
                                        setAttendanceDate(e.target.value);
                                        if (selectedClass) fetchClassAttendance(selectedClass.id, e.target.value);
                                    }}
                                    className="bg-slate-800 border-slate-700 w-40"
                                />
                                <Button
                                    onClick={handleSaveAttendance}
                                    disabled={savingAttendance || !selectedClass || classAttendance.length === 0}
                                    className="bg-green-600 hover:bg-green-700"
                                >
                                    {savingAttendance ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Check className="h-4 w-4 mr-2" />}
                                    Save Attendance
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <Select
                                value={selectedClass?.id.toString() || ""}
                                onValueChange={v => {
                                    const c = classes.find(c => c.id.toString() === v)!;
                                    handleClassSelect(c);
                                    fetchClassAttendance(c.id, attendanceDate);
                                }}
                            >
                                <SelectTrigger className="bg-slate-800 border-slate-700">
                                    <SelectValue placeholder="Select Class to Mark Attendance" />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-800 border-slate-700">
                                    {classes.map(c => <SelectItem key={c.id} value={c.id.toString()}>{c.class_name}</SelectItem>)}
                                </SelectContent>
                            </Select>

                            <div className="rounded-xl border border-slate-700 overflow-hidden">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-900/50 text-slate-400 text-xs font-medium uppercase">
                                        <tr>
                                            <th className="px-6 py-4">Student</th>
                                            <th className="px-6 py-4">Roll Number</th>
                                            <th className="px-6 py-4 text-center">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-700">
                                        {classAttendance.length === 0 ? (
                                            <tr>
                                                <td colSpan={3} className="px-6 py-12 text-center text-slate-500">
                                                    {selectedClass ? "No students found in this class" : "Select a class to view attendance"}
                                                </td>
                                            </tr>
                                        ) : (
                                            classAttendance.map((student) => (
                                                <tr key={student.student_id} className="bg-slate-800/20">
                                                    <td className="px-6 py-4">
                                                        <div className="font-medium text-white">{student.first_name} {student.last_name}</div>
                                                    </td>
                                                    <td className="px-6 py-4 text-slate-400 font-mono text-sm">{student.roll_number}</td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center justify-center gap-2">
                                                            <button
                                                                onClick={() => handleMarkAttendance(student.student_id, 'present')}
                                                                disabled={markingStudentId === student.student_id}
                                                                className={cn(
                                                                    "px-3 py-1 rounded-full text-xs transition-all flex items-center gap-1",
                                                                    student.status === 'present'
                                                                        ? "bg-green-500 text-white"
                                                                        : "bg-slate-700 text-slate-400 hover:bg-slate-600"
                                                                )}
                                                            >
                                                                {markingStudentId === student.student_id && student.status !== 'present' && <Loader2 className="h-3 w-3 animate-spin" />}
                                                                Present
                                                            </button>
                                                            <button
                                                                onClick={() => handleMarkAttendance(student.student_id, 'absent')}
                                                                disabled={markingStudentId === student.student_id}
                                                                className={cn(
                                                                    "px-3 py-1 rounded-full text-xs transition-all flex items-center gap-1",
                                                                    student.status === 'absent'
                                                                        ? "bg-red-500 text-white"
                                                                        : "bg-slate-700 text-slate-400 hover:bg-slate-600"
                                                                )}
                                                            >
                                                                {markingStudentId === student.student_id && student.status !== 'absent' && <Loader2 className="h-3 w-3 animate-spin" />}
                                                                Absent
                                                            </button>
                                                            <button
                                                                onClick={() => handleMarkAttendance(student.student_id, 'late')}
                                                                disabled={markingStudentId === student.student_id}
                                                                className={cn(
                                                                    "px-3 py-1 rounded-full text-xs transition-all flex items-center gap-1",
                                                                    student.status === 'late'
                                                                        ? "bg-yellow-500 text-white"
                                                                        : "bg-slate-700 text-slate-400 hover:bg-slate-600"
                                                                )}
                                                            >
                                                                {markingStudentId === student.student_id && student.status !== 'late' && <Loader2 className="h-3 w-3 animate-spin" />}
                                                                Late
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {activeSection === "profile" && (
                <Card className="border-0 bg-slate-800/50 backdrop-blur-xl shadow-xl p-6">
                    <div className="flex items-center gap-6 mb-8">
                        <Avatar className="h-24 w-24 border-4 border-purple-500/30">
                            <AvatarFallback className="bg-purple-600 text-3xl font-bold">
                                {teacher?.firstName?.[0]}{teacher?.lastName?.[0]}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <h2 className="text-2xl font-bold text-white">{teacher?.firstName} {teacher?.lastName}</h2>
                            <p className="text-slate-400">{teacher?.email}</p>
                        </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="p-4 bg-slate-700/30 rounded-lg">
                            <Label className="text-slate-500">Department</Label>
                            <p className="font-medium text-white">{teacher?.department}</p>
                        </div>
                        <div className="p-4 bg-slate-700/30 rounded-lg">
                            <Label className="text-slate-500">Employee ID</Label>
                            <p className="font-medium text-white">{teacher?.employeeId}</p>
                        </div>
                        <div className="p-4 bg-slate-700/30 rounded-lg">
                            <Label className="text-slate-500">Subjects</Label>
                            <p className="font-medium text-white">{teacher?.subjects}</p>
                        </div>
                    </div>
                </Card>
            )}
        </div>
    )
}
