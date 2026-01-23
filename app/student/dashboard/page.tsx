"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Calendar, GraduationCap, TrendingUp, User, Users, Award, Sparkles, Star, Target } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

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
    total: number
    present: number
    absent: number
    late: number
    excused: number
    percentage: number
}

export default function StudentDashboard() {
    const [grades, setGrades] = useState<Grade[]>([])
    const [classes, setClasses] = useState<Class[]>([])
    const [attendance, setAttendance] = useState<Attendance[]>([])
    const [attendanceStats, setAttendanceStats] = useState<AttendanceStats | null>(null)
    const [loading, setLoading] = useState(true)
    const [studentId, setStudentId] = useState<number | null>(null)

    useEffect(() => {
        const mockStudentId = 1
        setStudentId(mockStudentId)
        fetchStudentData(mockStudentId)
    }, [])

    const fetchStudentData = async (id: number) => {
        setLoading(true)
        try {
            const gradesRes = await fetch(`http://localhost:3001/grades/student/${id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
            if (gradesRes.ok) {
                const gradesData = await gradesRes.json()
                setGrades(gradesData.data || gradesData)
            }

            const classesRes = await fetch(`http://localhost:3001/classes/student/${id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
            if (classesRes.ok) {
                const classesData = await classesRes.json()
                setClasses(classesData)
            }

            const attendanceRes = await fetch(`http://localhost:3001/attendance/student/${id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
            if (attendanceRes.ok) {
                const attendanceData = await attendanceRes.json()
                setAttendance(attendanceData.data || [])
            }

            const statsRes = await fetch(`http://localhost:3001/attendance/statistics/${id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
            if (statsRes.ok) {
                const statsData = await statsRes.json()
                setAttendanceStats(statsData.data)
            }
        } catch (error) {
            console.error('Error fetching student data:', error)
        } finally {
            setLoading(false)
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
            case 'present':
                return 'bg-green-500/20 text-green-300 border-green-500/30'
            case 'absent':
                return 'bg-red-500/20 text-red-300 border-red-500/30'
            case 'late':
                return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
            case 'excused':
                return 'bg-blue-500/20 text-blue-300 border-blue-500/30'
            default:
                return 'bg-slate-500/20 text-slate-300 border-slate-500/30'
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
        ? grades.reduce((sum, g) => sum + (g.grade / g.max_grade) * 100, 0) / grades.length
        : 0

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
            <div className="mx-auto max-w-7xl space-y-6">
                {/* Header with Gradient */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-8 shadow-2xl">
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl"></div>
                    <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-white/10 blur-3xl"></div>
                    <div className="relative flex items-center justify-between">
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <Star className="h-8 w-8 text-yellow-300 animate-pulse" />
                                <h1 className="text-4xl font-bold tracking-tight text-white">Student Dashboard</h1>
                            </div>
                            <p className="text-lg text-purple-100">
                                Welcome back! Here's your academic overview
                            </p>
                            <div className="flex items-center gap-2 text-sm text-purple-200">
                                <Target className="h-4 w-4" />
                                <span>Keep up the great work!</span>
                            </div>
                        </div>
                        <Avatar className="h-20 w-20 border-4 border-white/30 shadow-xl">
                            <AvatarImage src="/placeholder-avatar.jpg" />
                            <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-pink-500 text-2xl font-bold text-white">
                                <User className="h-10 w-10" />
                            </AvatarFallback>
                        </Avatar>
                    </div>
                </div>

                {/* Stats Cards with Glassmorphism */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card className="border-0 bg-gradient-to-br from-indigo-500/10 to-indigo-600/10 backdrop-blur-xl shadow-xl hover:scale-105 transition-transform">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-indigo-300">Total Classes</CardTitle>
                            <div className="rounded-full bg-indigo-500/20 p-2">
                                <BookOpen className="h-5 w-5 text-indigo-400" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-white">{classes.length}</div>
                            <p className="text-xs text-indigo-300">Active enrollments</p>
                        </CardContent>
                    </Card>

                    <Card className="border-0 bg-gradient-to-br from-green-500/10 to-green-600/10 backdrop-blur-xl shadow-xl hover:scale-105 transition-transform">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-green-300">Attendance Rate</CardTitle>
                            <div className="rounded-full bg-green-500/20 p-2">
                                <Calendar className="h-5 w-5 text-green-400" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-white">
                                {attendanceStats ? `${attendanceStats.percentage.toFixed(1)}%` : 'N/A'}
                            </div>
                            <p className="text-xs text-green-300">
                                {attendanceStats ? `${attendanceStats.present}/${attendanceStats.total} days` : 'No data'}
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-0 bg-gradient-to-br from-purple-500/10 to-purple-600/10 backdrop-blur-xl shadow-xl hover:scale-105 transition-transform">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-purple-300">Average Grade</CardTitle>
                            <div className="rounded-full bg-purple-500/20 p-2">
                                <TrendingUp className="h-5 w-5 text-purple-400" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className={`text-3xl font-bold ${getGradeColor(averageGrade)}`}>
                                {averageGrade > 0 ? `${averageGrade.toFixed(1)}%` : 'N/A'}
                            </div>
                            <p className="text-xs text-purple-300">Across all subjects</p>
                        </CardContent>
                    </Card>

                    <Card className="border-0 bg-gradient-to-br from-pink-500/10 to-pink-600/10 backdrop-blur-xl shadow-xl hover:scale-105 transition-transform">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-pink-300">Total Grades</CardTitle>
                            <div className="rounded-full bg-pink-500/20 p-2">
                                <GraduationCap className="h-5 w-5 text-pink-400" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-white">{grades.length}</div>
                            <p className="text-xs text-pink-300">Recorded assessments</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content Tabs */}
                <Tabs defaultValue="grades" className="space-y-4">
                    <TabsList className="grid w-full grid-cols-3 bg-slate-800/50 backdrop-blur-xl border border-slate-700">
                        <TabsTrigger value="grades" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white">
                            Grades
                        </TabsTrigger>
                        <TabsTrigger value="classes" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white">
                            Classes
                        </TabsTrigger>
                        <TabsTrigger value="attendance" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white">
                            Attendance
                        </TabsTrigger>
                    </TabsList>

                    {/* Grades Tab */}
                    <TabsContent value="grades" className="space-y-4">
                        <Card className="border-0 bg-slate-800/50 backdrop-blur-xl shadow-xl">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <Award className="h-6 w-6 text-yellow-400" />
                                    My Grades
                                </CardTitle>
                                <CardDescription className="text-slate-400">View all your subject grades and assessments</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {grades.length === 0 ? (
                                    <div className="py-12 text-center">
                                        <GraduationCap className="mx-auto h-12 w-12 text-slate-600" />
                                        <p className="mt-4 text-slate-400">No grades recorded yet</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {grades.map((grade) => {
                                            const percentage = (grade.grade / grade.max_grade) * 100
                                            return (
                                                <div
                                                    key={grade.id}
                                                    className="group relative overflow-hidden rounded-xl border border-slate-700 bg-gradient-to-r from-slate-800/50 to-slate-700/50 p-5 transition-all hover:scale-[1.02] hover:shadow-2xl hover:border-purple-500/50"
                                                >
                                                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-purple-600/5 to-pink-600/0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                                    <div className="relative flex items-center justify-between">
                                                        <div className="space-y-2 flex-1">
                                                            <div className="flex items-center gap-3">
                                                                <h3 className="font-semibold text-lg text-white">{grade.subject_name}</h3>
                                                                <Badge variant="outline" className="border-slate-600 text-slate-300">{grade.subject_code}</Badge>
                                                                <Badge className={`${getGradeBadgeColor(percentage)} text-white border-0`}>
                                                                    {grade.exam_type}
                                                                </Badge>
                                                            </div>
                                                            <div className="flex items-center gap-4 text-sm text-slate-400">
                                                                {grade.class_name && (
                                                                    <>
                                                                        <span className="flex items-center gap-1">
                                                                            <BookOpen className="h-3 w-3" />
                                                                            {grade.class_name}
                                                                        </span>
                                                                        <span>•</span>
                                                                    </>
                                                                )}
                                                                <span className="flex items-center gap-1">
                                                                    <Calendar className="h-3 w-3" />
                                                                    {new Date(grade.exam_date).toLocaleDateString()}
                                                                </span>
                                                            </div>
                                                            {grade.remarks && (
                                                                <p className="text-sm text-slate-400 italic">"{grade.remarks}"</p>
                                                            )}
                                                        </div>
                                                        <div className="text-right ml-6">
                                                            <div className={`text-4xl font-bold ${getGradeColor(percentage)}`}>
                                                                {percentage.toFixed(1)}%
                                                            </div>
                                                            <div className="text-sm text-slate-400 mt-1">
                                                                {grade.grade}/{grade.max_grade}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Classes Tab */}
                    <TabsContent value="classes" className="space-y-4">
                        <Card className="border-0 bg-slate-800/50 backdrop-blur-xl shadow-xl">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <BookOpen className="h-6 w-6 text-blue-400" />
                                    My Classes
                                </CardTitle>
                                <CardDescription className="text-slate-400">Your enrolled classes for this semester</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {classes.length === 0 ? (
                                    <div className="py-12 text-center">
                                        <BookOpen className="mx-auto h-12 w-12 text-slate-600" />
                                        <p className="mt-4 text-slate-400">No classes enrolled</p>
                                    </div>
                                ) : (
                                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                        {classes.map((classItem) => (
                                            <Card key={classItem.id} className="group overflow-hidden border-0 bg-gradient-to-br from-slate-700/50 to-slate-800/50 backdrop-blur-xl transition-all hover:scale-105 hover:shadow-2xl">
                                                <div className="h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
                                                <CardHeader>
                                                    <div className="flex items-start justify-between">
                                                        <div>
                                                            <CardTitle className="text-lg text-white">{classItem.class_name}</CardTitle>
                                                            <CardDescription className="text-slate-400">{classItem.class_code}</CardDescription>
                                                        </div>
                                                        <Badge className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-0">
                                                            Grade {classItem.grade_level}
                                                        </Badge>
                                                    </div>
                                                </CardHeader>
                                                <CardContent className="space-y-3">
                                                    <div className="flex items-center gap-2 text-sm text-slate-300">
                                                        <User className="h-4 w-4 text-purple-400" />
                                                        <span>{classItem.teacher_name}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm text-slate-300">
                                                        <BookOpen className="h-4 w-4 text-blue-400" />
                                                        <span>Room {classItem.room_number}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm text-slate-400">
                                                        <Calendar className="h-4 w-4" />
                                                        <span>Enrolled: {new Date(classItem.enrollment_date).toLocaleDateString()}</span>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Attendance Tab */}
                    <TabsContent value="attendance" className="space-y-4">
                        <Card className="border-0 bg-slate-800/50 backdrop-blur-xl shadow-xl">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <Calendar className="h-6 w-6 text-green-400" />
                                    Attendance Record
                                </CardTitle>
                                <CardDescription className="text-slate-400">Your attendance history and statistics</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {attendanceStats && (
                                    <div className="mb-6 grid gap-4 md:grid-cols-4">
                                        <div className="rounded-lg bg-green-500/10 border border-green-500/30 p-4">
                                            <div className="text-2xl font-bold text-green-400">{attendanceStats.present}</div>
                                            <div className="text-xs text-green-300">Present</div>
                                        </div>
                                        <div className="rounded-lg bg-red-500/10 border border-red-500/30 p-4">
                                            <div className="text-2xl font-bold text-red-400">{attendanceStats.absent}</div>
                                            <div className="text-xs text-red-300">Absent</div>
                                        </div>
                                        <div className="rounded-lg bg-yellow-500/10 border border-yellow-500/30 p-4">
                                            <div className="text-2xl font-bold text-yellow-400">{attendanceStats.late}</div>
                                            <div className="text-xs text-yellow-300">Late</div>
                                        </div>
                                        <div className="rounded-lg bg-blue-500/10 border border-blue-500/30 p-4">
                                            <div className="text-2xl font-bold text-blue-400">{attendanceStats.excused}</div>
                                            <div className="text-xs text-blue-300">Excused</div>
                                        </div>
                                    </div>
                                )}

                                {attendance.length === 0 ? (
                                    <div className="py-12 text-center">
                                        <Calendar className="mx-auto h-12 w-12 text-slate-600" />
                                        <p className="mt-4 text-slate-400">No attendance records</p>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {attendance.slice(0, 20).map((record) => (
                                            <div
                                                key={record.id}
                                                className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-800/50 p-4 transition-all hover:bg-slate-700/50"
                                            >
                                                <div className="space-y-1">
                                                    <div className="font-medium text-white">{record.class_name}</div>
                                                    <div className="text-sm text-slate-400">
                                                        {new Date(record.attendance_date).toLocaleDateString('en-US', {
                                                            weekday: 'long',
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric'
                                                        })}
                                                    </div>
                                                    {record.remarks && (
                                                        <p className="text-sm text-slate-500 italic">"{record.remarks}"</p>
                                                    )}
                                                </div>
                                                <Badge className={`${getAttendanceStatusColor(record.status)} border capitalize`}>
                                                    {record.status}
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
