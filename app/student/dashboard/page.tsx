"use client"

import { useEffect, useState } from "react"
import { authenticatedFetch, getCurrentUser, getUserId, getStudentIdFromUserId, logout } from "@/lib/auth-utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { BookOpen, Calendar, GraduationCap, TrendingUp, User, Users, Award, Sparkles, Star, Target, Bell, Megaphone, Trophy, AlertCircle, Clock, Loader2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface Grade {
    id: number
    subject_name: string
    subject_code: string
    exam_type: string
    grade: number
    max_grade: number
    exam_date: string
    class_name?: string
    remarks?: string
}

interface Student {
    id: number
    student_id: string
    first_name: string
    last_name: string
    email: string
    date_of_birth: string
    gender: string
    address: string
    parent_name: string
    parent_phone: string
    parent_email: string
    enrollment_date: string
    grade_level: number
}

interface Class {
    id: number
    class_name: string
    class_code: string
    grade_level: number
    section: string
    teacher_name: string
    room_number: string
    enrollment_date: string
}

interface Attendance {
    id: number
    attendance_date: string
    status: string
    class_name: string
    remarks?: string
}

interface AttendanceStats {
    total_days: number
    present_days: number
    absent_days: number
    late_days: number
    excused_days: number
    attendance_percentage: number
}

interface LibraryIssue {
    id: number
    book_id: number
    student_id: number
    issue_date: string
    due_date: string
    return_date: string | null
    status: string
    fine_amount: number
    title: string
    author: string
    isbn: string
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
    teacher_first_name?: string
    teacher_last_name?: string
}

export default function StudentDashboard() {
    const [grades, setGrades] = useState<Grade[]>([])
    const [classes, setClasses] = useState<Class[]>([])
    const [attendance, setAttendance] = useState<Attendance[]>([])
    const [attendanceStats, setAttendanceStats] = useState<AttendanceStats | null>(null)
    const [announcements, setAnnouncements] = useState<Announcement[]>([])
    const [timetable, setTimetable] = useState<TimetableEntry[]>([])
    const [libraryIssues, setLibraryIssues] = useState<LibraryIssue[]>([])
    const [loading, setLoading] = useState(true)
    const [studentId, setStudentId] = useState<number | null>(null)
    const [studentInfo, setStudentInfo] = useState<Student | null>(null)
    const [activeSection, setActiveSection] = useState("announcements")

    useEffect(() => {
        const handleNav = (e: any) => setActiveSection(e.detail)
        window.addEventListener("student-dashboard-nav", handleNav)
        return () => window.removeEventListener("student-dashboard-nav", handleNav)
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
                const sId = await getStudentIdFromUserId(userId)
                if (sId) {
                    setStudentId(sId)
                    fetchStudentData(sId)
                } else {
                    console.error("Could not find student profile for user", userId)
                    setLoading(false)
                }
            } else {
                setLoading(false)
            }
        }
        fetchId()
    }, [])

    const fetchStudentData = async (id: number) => {
        setLoading(true)
        try {
            const [gradesRes, classesRes, attendanceRes, statsRes, announcementsRes, studentRes, libraryRes] = await Promise.all([
                fetch(`http://localhost:4000/api/grades/student/${id}`, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
                }),
                fetch(`http://localhost:4000/api/classes/student/${id}`, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
                }),
                fetch(`http://localhost:4000/api/attendance/student/${id}`, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
                }),
                fetch(`http://localhost:4000/api/attendance/statistics/${id}`, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
                }),
                fetch(`http://localhost:4000/api/announcements?audience=students`, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
                }),
                fetch(`http://localhost:4000/api/students/${id}`, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
                }),
                fetch(`http://localhost:4000/api/library/student/${id}/issues`, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
                })
            ])

            if (gradesRes.ok) {
                const data = await gradesRes.json()
                setGrades(data.data || data)
            }
            if (classesRes.ok) {
                const data = await classesRes.json()
                setClasses(data)
                if (data.length > 0) {
                    fetchTimetable(data[0].id)
                }
            }
            if (attendanceRes.ok) {
                const data = await attendanceRes.json()
                setAttendance(data.data || [])
            }
            if (statsRes.ok) {
                const data = await statsRes.json()
                setAttendanceStats(data.data)
            }
            if (announcementsRes.ok) {
                const data = await announcementsRes.json()
                setAnnouncements(data.data)
            }
            if (studentRes.ok) {
                const data = await studentRes.json()
                setStudentInfo(data.data || data)
            }
            if (libraryRes.ok) {
                const data = await libraryRes.json()
                setLibraryIssues(data.data || [])
            }
        } catch (error) {
            console.error('Error fetching student data:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = () => {
        logout()
    }

    const fetchTimetable = async (classId: number) => {
        try {
            const res = await fetch(`http://localhost:4000/api/timetable/class/${classId}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
            })
            if (res.ok) {
                const data = await res.json()
                setTimetable(data.data)
            }
        } catch (error) {
            console.error('Error fetching timetable:', error)
        }
    }

    const getGradeColor = (percentage: number) => {
        if (percentage >= 90) return "text-green-400"
        if (percentage >= 80) return "text-blue-400"
        if (percentage >= 70) return "text-yellow-400"
        if (percentage >= 60) return "text-orange-400"
        return "text-red-400"
    }

    const getGradeBadgeColor = (percentage: number) => {
        if (percentage >= 90) return "bg-gradient-to-r from-green-500 to-emerald-500"
        if (percentage >= 80) return "bg-gradient-to-r from-blue-500 to-cyan-500"
        if (percentage >= 70) return "bg-gradient-to-r from-yellow-500 to-amber-500"
        if (percentage >= 60) return "bg-gradient-to-r from-orange-500 to-red-500"
        return "bg-gradient-to-r from-red-500 to-pink-500"
    }

    const getAttendanceStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'present': return 'bg-green-500/20 text-green-300 border-green-500/30'
            case 'absent': return 'bg-red-500/20 text-red-300 border-red-500/30'
            case 'late': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
            case 'excused': return 'bg-blue-500/20 text-blue-300 border-blue-500/30'
            default: return 'bg-slate-500/20 text-slate-300 border-slate-500/30'
        }
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
            <div className="flex h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
                <div className="text-center">
                    <div className="relative h-32 w-32">
                        <div className="absolute inset-0 animate-spin rounded-full border-4 border-t-purple-500 border-r-blue-500 border-b-transparent border-l-transparent"></div>
                        <div className="absolute inset-2 animate-spin rounded-full border-4 border-t-transparent border-r-transparent border-b-pink-500 border-l-cyan-500" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                    </div>
                    <p className="mt-6 text-lg font-medium text-slate-300">Loading your dashboard...</p>
                    <p className="mt-2 text-sm text-slate-500">Preparing your academic journey</p>
                </div>
            </div>
        )
    }

    const averageGrade = grades.length > 0
        ? grades.reduce((sum, g) => sum + (Number(g.grade) / Number(g.max_grade)) * 100, 0) / grades.length
        : 0

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Stats Cards - Always visible on top of sections or only on announcements? 
                User said "only header and announcement setted on the first page".
                I'll keep stats only on announcements for a cleaner look. 
            */}

            {activeSection === "announcements" && (
                <>
                    <div className="grid gap-4 md:grid-cols-4">
                        <Card className="border-0 bg-indigo-500/10 backdrop-blur-xl shadow-xl hover:scale-105 transition-transform"><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium text-indigo-300">Total Classes</CardTitle><BookOpen className="h-5 w-5 text-indigo-400" /></CardHeader><CardContent><div className="text-3xl font-bold text-white">{classes.length}</div><p className="text-xs text-indigo-300">Active enrollments</p></CardContent></Card>
                        <Card className="border-0 bg-green-500/10 backdrop-blur-xl shadow-xl hover:scale-105 transition-transform"><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium text-green-300">Attendance Rate</CardTitle><Calendar className="h-5 w-5 text-green-400" /></CardHeader><CardContent><div className="text-3xl font-bold text-white">{attendanceStats ? `${Number(attendanceStats.attendance_percentage || 0).toFixed(1)}%` : 'N/A'}</div><p className="text-xs text-green-300">{attendanceStats ? `${attendanceStats.present_days}/${attendanceStats.total_days} days` : 'No data'}</p></CardContent></Card>
                        <Card className="border-0 bg-purple-500/10 backdrop-blur-xl shadow-xl hover:scale-105 transition-transform"><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium text-purple-300">Average Grade</CardTitle><TrendingUp className="h-5 w-5 text-purple-400" /></CardHeader><CardContent><div className={`text-3xl font-bold ${getGradeColor(averageGrade)}`}>{averageGrade > 0 ? `${averageGrade.toFixed(1)}%` : 'N/A'}</div><p className="text-xs text-purple-300">Across all subjects</p></CardContent></Card>
                        <Card className="border-0 bg-pink-500/10 backdrop-blur-xl shadow-xl hover:scale-105 transition-transform"><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium text-pink-300">Announcements</CardTitle><Megaphone className="h-5 w-5 text-pink-400" /></CardHeader><CardContent><div className="text-3xl font-bold text-white">{announcements.length}</div><p className="text-xs text-pink-300">Latest updates</p></CardContent></Card>
                    </div>

                    <Card className="border-0 bg-slate-800/50 backdrop-blur-xl shadow-xl">
                        <CardHeader><CardTitle className="text-white">Recent Announcements</CardTitle></CardHeader>
                        <CardContent>
                            {announcements.length === 0 ? (
                                <div className="py-12 text-center text-slate-400"><Megaphone className="mx-auto h-12 w-12 text-slate-600 mb-4" />No new announcements</div>
                            ) : (
                                <div className="space-y-4">
                                    {announcements.map((a) => (
                                        <div key={a.id} className="p-4 rounded-xl border border-slate-700 bg-slate-800/30">
                                            <div className="flex items-start gap-4">
                                                <div className="p-2 rounded-full bg-indigo-500/20 text-indigo-400">{getAnnouncementIcon(a.announcement_type)}</div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start mb-1">
                                                        <h3 className="font-semibold text-white">{a.title}</h3>
                                                        <Badge variant="outline" className="capitalize text-[10px]">{a.priority}</Badge>
                                                    </div>
                                                    <p className="text-sm text-slate-400 whitespace-pre-wrap">{a.content}</p>
                                                    <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                                                        <span>By {a.posted_by_first_name || a.posted_by_first_name} {a.posted_by_last_name || a.posted_by_last_name}</span>
                                                        <span>•</span>
                                                        <span>{a.posted_at ? new Date(a.posted_at).toLocaleDateString() : 'N/A'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </>
            )}

            {activeSection === "timetable" && (
                <Card className="border-0 bg-slate-800/50 backdrop-blur-xl shadow-xl">
                    <CardHeader><CardTitle className="text-white">Weekly Schedule</CardTitle></CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <div className="grid grid-cols-6 gap-2 min-w-[800px]">
                                <div className="space-y-2">
                                    <div className="h-10 flex items-center justify-center font-bold text-slate-400 text-xs">TIME</div>
                                    {timeSlots.map((slot, i) => (
                                        <div key={i} className="h-20 flex flex-col items-center justify-center rounded-lg border border-slate-700 bg-slate-800/40 text-[10px] text-slate-400">
                                            <Clock className="h-3 w-3 mb-1" />
                                            <span>{slot.start}</span>
                                            <span>{slot.end}</span>
                                        </div>
                                    ))}
                                </div>
                                {days.map((day) => (
                                    <div key={day} className="space-y-2">
                                        <div className="h-10 flex items-center justify-center font-bold text-indigo-400 text-xs uppercase tracking-wider">{day}</div>
                                        {timeSlots.map((slot, i) => {
                                            const entry = timetable.find(e => e.day_of_week === day && e.start_time.startsWith(slot.start))
                                            return (
                                                <div key={i} className="h-20 rounded-lg border border-slate-700 bg-slate-800/20 p-2 overflow-hidden">
                                                    {entry ? (
                                                        <>
                                                            <p className="font-bold text-[11px] text-white leading-tight truncate">{entry.subject_name}</p>
                                                            <p className="text-[10px] text-slate-400 truncate">{(entry.teacher_first_name || entry.teacher_first_name)} {(entry.teacher_last_name || entry.teacher_last_name)}</p>
                                                            <Badge variant="outline" className="text-[9px] h-3 px-1 mt-1 border-slate-600 text-slate-400">RM {entry.room_number}</Badge>
                                                        </>
                                                    ) : (
                                                        <div className="h-full flex items-center justify-center text-[9px] text-slate-700">Free</div>
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

            {activeSection === "grades" && (
                <Card className="border-0 bg-slate-800/50 backdrop-blur-xl shadow-xl">
                    <CardHeader><CardTitle className="text-white flex items-center gap-2"><Award className="h-6 w-6 text-yellow-400" />My Grades</CardTitle></CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {grades.map((grade) => {
                                const perc = (grade.grade / grade.max_grade) * 100
                                return (
                                    <div key={grade.id} className="rounded-xl border border-slate-700 bg-slate-800/50 p-5 flex justify-between items-center transition-all hover:border-indigo-500/50">
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <h3 className="font-semibold text-white">{grade.subject_name}</h3>
                                                <Badge variant="outline" className="border-slate-600 text-slate-400">{grade.subject_code}</Badge>
                                                <Badge className={getGradeBadgeColor(perc)}>{grade.exam_type}</Badge>
                                            </div>
                                            <p className="text-xs text-slate-500">{new Date(grade.exam_date).toLocaleDateString()}</p>
                                        </div>
                                        <div className="text-right">
                                            <div className={`text-2xl font-bold ${getGradeColor(perc)}`}>{perc.toFixed(1)}%</div>
                                            <div className="text-[10px] text-slate-500">{grade.grade}/{grade.max_grade}</div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </CardContent>
                </Card>
            )}

            {activeSection === "classes" && (
                <Card className="border-0 bg-slate-800/50 backdrop-blur-xl shadow-xl">
                    <CardHeader><CardTitle className="text-white">Enrolled Classes</CardTitle></CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {classes.map((c) => (
                                <Card key={c.id} className="border-0 bg-slate-700/50 p-4"><h3 className="font-bold text-white mb-1">{c.class_name}</h3><p className="text-xs text-slate-400 mb-2">{c.class_code}</p><div className="space-y-1 text-xs text-slate-300"><div>Teacher: {c.teacher_name}</div><div>Room: {c.room_number}</div><div>Section: {c.section}</div></div></Card>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {activeSection === "attendance" && (
                <Card className="border-0 bg-slate-800/50 backdrop-blur-xl shadow-xl">
                    <CardHeader><CardTitle className="text-white">Attendance History</CardTitle></CardHeader>
                    <CardContent>
                        {attendanceStats && <div className="grid grid-cols-4 gap-4 mb-6 text-center"><div className="p-3 rounded-lg bg-green-500/10 text-green-400"><div className="text-xl font-bold">{attendanceStats.present_days}</div><div className="text-[10px]">Present</div></div><div className="p-3 rounded-lg bg-red-500/10 text-red-400"><div className="text-xl font-bold">{attendanceStats.absent_days}</div><div className="text-[10px]">Absent</div></div><div className="p-3 rounded-lg bg-yellow-500/10 text-yellow-400"><div className="text-xl font-bold">{attendanceStats.late_days}</div><div className="text-[10px]">Late</div></div><div className="p-3 rounded-lg bg-blue-500/10 text-blue-400"><div className="text-xl font-bold">{attendanceStats.excused_days}</div><div className="text-[10px]">Excused</div></div></div>}
                        <div className="space-y-2">{attendance.slice(0, 10).map((r) => (<div key={r.id} className="flex justify-between items-center p-3 border border-slate-700 rounded-lg"><div><div className="text-sm font-medium text-white">{r.class_name}</div><div className="text-[10px] text-slate-500">{new Date(r.attendance_date).toLocaleDateString()}</div></div><Badge className={getAttendanceStatusColor(r.status)}>{r.status}</Badge></div>))}</div>
                    </CardContent>
                </Card>
            )}

            {activeSection === "library" && (
                <Card className="border-0 bg-slate-800/50 backdrop-blur-xl shadow-xl">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-white flex items-center gap-2">
                            <BookOpen className="h-6 w-6 text-indigo-400" />
                            Library Records
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {libraryIssues.length === 0 ? (
                            <div className="py-12 text-center text-slate-500">
                                <BookOpen className="mx-auto h-12 w-12 text-slate-700 mb-4" />
                                No library records found
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {libraryIssues.map((issue) => (
                                    <div key={issue.id} className="group relative overflow-hidden rounded-xl border border-slate-700 bg-slate-800/30 p-5 transition-all hover:border-indigo-500/50 hover:bg-slate-800/50">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div className="flex items-start gap-4">
                                                <div className={`p-3 rounded-lg ${issue.status === 'overdue' ? 'bg-red-500/10 text-red-400' : 'bg-indigo-500/10 text-indigo-400'}`}>
                                                    <BookOpen className="h-6 w-6" />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-white group-hover:text-indigo-300 transition-colors">{issue.title}</h3>
                                                    <p className="text-sm text-slate-400">{issue.author}</p>
                                                </div>
                                            </div>
                                            <Badge className={cn(
                                                "w-fit",
                                                issue.status === 'issued' && 'bg-blue-500/20 text-blue-300 border-blue-500/30',
                                                issue.status === 'returned' && 'bg-green-500/20 text-green-300 border-green-500/30',
                                                issue.status === 'overdue' && 'bg-red-500/20 text-red-300 border-red-500/30 animate-pulse'
                                            )}>
                                                {issue.status.toUpperCase()}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {activeSection === "profile" && (
                <Card className="border-0 bg-slate-800/50 backdrop-blur-xl shadow-xl p-6">
                    <div className="flex items-center gap-6 mb-8">
                        <Avatar className="h-24 w-24 border-4 border-indigo-500/30">
                            <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-pink-500 text-3xl font-bold text-white">
                                {studentInfo ? `${(studentInfo.first_name || studentInfo.first_name)?.[0]}${(studentInfo.last_name || studentInfo.last_name)?.[0]}` : <User className="h-12 w-12" />}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <h2 className="text-3xl font-bold text-white tracking-tight">{studentInfo?.first_name || studentInfo?.first_name} {studentInfo?.last_name || studentInfo?.last_name}</h2>
                            <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="border-indigo-500/50 text-indigo-400">{studentInfo?.student_id}</Badge>
                                <Badge className="bg-green-500/20 text-green-300 border-green-500/30">Active Student</Badge>
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-6">
                        <section>
                            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-700 pb-2">Academic Information</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="p-4 bg-slate-700/30 rounded-xl border border-slate-700/50">
                                    <Label className="text-slate-500 text-xs font-medium">Grade Level</Label>
                                    <p className="text-white font-semibold mt-0.5">Grade {studentInfo?.grade_level}</p>
                                </div>
                                <div className="p-4 bg-slate-700/30 rounded-xl border border-slate-700/50">
                                    <Label className="text-slate-500 text-xs font-medium">Enrollment Date</Label>
                                    <p className="text-white font-semibold mt-0.5">{studentInfo ? new Date(studentInfo.enrollment_date).toLocaleDateString() : 'N/A'}</p>
                                </div>
                            </div>
                        </section>
                        {/* More personal details sections can go here, similar to the original */}
                    </div>
                </Card>
            )}
        </div>
    )
}
