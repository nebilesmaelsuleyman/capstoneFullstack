"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Calendar, GraduationCap, TrendingUp, User } from "lucide-react"
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
        // TODO: Get actual student ID from auth context
        // For now, using a hardcoded value
        const mockStudentId = 1
        setStudentId(mockStudentId)
        fetchStudentData(mockStudentId)
    }, [])

    const fetchStudentData = async (id: number) => {
        setLoading(true)
        try {
            // Fetch grades
            const gradesRes = await fetch(`http://localhost:3001/grades/student/${id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
            if (gradesRes.ok) {
                const gradesData = await gradesRes.json()
                setGrades(gradesData.data || gradesData)
            }

            // Fetch classes
            const classesRes = await fetch(`http://localhost:3001/classes/student/${id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
            if (classesRes.ok) {
                const classesData = await classesRes.json()
                setClasses(classesData)
            }

            // Fetch attendance
            const attendanceRes = await fetch(`http://localhost:3001/attendance/student/${id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
            if (attendanceRes.ok) {
                const attendanceData = await attendanceRes.json()
                setAttendance(attendanceData.data || [])
            }

            // Fetch attendance statistics
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
        if (percentage >= 90) return "text-green-600"
        if (percentage >= 80) return "text-blue-600"
        if (percentage >= 70) return "text-yellow-600"
        if (percentage >= 60) return "text-orange-600"
        return "text-red-600"
    }

    const getAttendanceStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'present':
                return 'bg-green-100 text-green-800'
            case 'absent':
                return 'bg-red-100 text-red-800'
            case 'late':
                return 'bg-yellow-100 text-yellow-800'
            case 'excused':
                return 'bg-blue-100 text-blue-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="text-center">
                    <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
                    <p className="mt-4 text-muted-foreground">Loading your dashboard...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
            <div className="mx-auto max-w-7xl space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Student Dashboard</h1>
                        <p className="text-muted-foreground">Welcome back! Here's your academic overview</p>
                    </div>
                    <Avatar className="h-16 w-16">
                        <AvatarImage src="/placeholder-avatar.jpg" />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                            <User className="h-8 w-8" />
                        </AvatarFallback>
                    </Avatar>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card className="border-l-4 border-l-blue-500">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
                            <BookOpen className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{classes.length}</div>
                            <p className="text-xs text-muted-foreground">Active enrollments</p>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-green-500">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {attendanceStats ? `${attendanceStats.percentage.toFixed(1)}%` : 'N/A'}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {attendanceStats ? `${attendanceStats.present}/${attendanceStats.total} days` : 'No data'}
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-purple-500">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Average Grade</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {grades.length > 0
                                    ? ((grades.reduce((sum, g) => sum + (g.grade / g.max_grade) * 100, 0) / grades.length).toFixed(1) + '%')
                                    : 'N/A'}
                            </div>
                            <p className="text-xs text-muted-foreground">Across all subjects</p>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-orange-500">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Grades</CardTitle>
                            <GraduationCap className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{grades.length}</div>
                            <p className="text-xs text-muted-foreground">Recorded assessments</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content Tabs */}
                <Tabs defaultValue="grades" className="space-y-4">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="grades">Grades</TabsTrigger>
                        <TabsTrigger value="classes">Classes</TabsTrigger>
                        <TabsTrigger value="attendance">Attendance</TabsTrigger>
                    </TabsList>

                    {/* Grades Tab */}
                    <TabsContent value="grades" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>My Grades</CardTitle>
                                <CardDescription>View all your subject grades and assessments</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {grades.length === 0 ? (
                                    <div className="py-12 text-center">
                                        <GraduationCap className="mx-auto h-12 w-12 text-muted-foreground" />
                                        <p className="mt-4 text-muted-foreground">No grades recorded yet</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {grades.map((grade) => {
                                            const percentage = (grade.grade / grade.max_grade) * 100
                                            return (
                                                <div
                                                    key={grade.id}
                                                    className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-accent"
                                                >
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2">
                                                            <h3 className="font-semibold">{grade.subject_name}</h3>
                                                            <Badge variant="outline">{grade.subject_code}</Badge>
                                                        </div>
                                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                            <span>{grade.exam_type}</span>
                                                            {grade.class_name && <span>• {grade.class_name}</span>}
                                                            <span>• {new Date(grade.exam_date).toLocaleDateString()}</span>
                                                        </div>
                                                        {grade.remarks && (
                                                            <p className="text-sm text-muted-foreground">{grade.remarks}</p>
                                                        )}
                                                    </div>
                                                    <div className="text-right">
                                                        <div className={`text-2xl font-bold ${getGradeColor(percentage)}`}>
                                                            {percentage.toFixed(1)}%
                                                        </div>
                                                        <div className="text-sm text-muted-foreground">
                                                            {grade.grade}/{grade.max_grade}
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
                        <Card>
                            <CardHeader>
                                <CardTitle>My Classes</CardTitle>
                                <CardDescription>Your enrolled classes for this semester</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {classes.length === 0 ? (
                                    <div className="py-12 text-center">
                                        <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
                                        <p className="mt-4 text-muted-foreground">No classes enrolled</p>
                                    </div>
                                ) : (
                                    <div className="grid gap-4 md:grid-cols-2">
                                        {classes.map((classItem) => (
                                            <Card key={classItem.id} className="overflow-hidden">
                                                <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-500" />
                                                <CardHeader>
                                                    <div className="flex items-start justify-between">
                                                        <div>
                                                            <CardTitle className="text-lg">{classItem.class_name}</CardTitle>
                                                            <CardDescription>{classItem.class_code}</CardDescription>
                                                        </div>
                                                        <Badge>Grade {classItem.grade_level}</Badge>
                                                    </div>
                                                </CardHeader>
                                                <CardContent className="space-y-2">
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <User className="h-4 w-4 text-muted-foreground" />
                                                        <span>{classItem.teacher_name}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                                                        <span>Room {classItem.room_number}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
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
                        <Card>
                            <CardHeader>
                                <CardTitle>Attendance Record</CardTitle>
                                <CardDescription>Your attendance history and statistics</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {attendance.length === 0 ? (
                                    <div className="py-12 text-center">
                                        <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
                                        <p className="mt-4 text-muted-foreground">No attendance records</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {attendance.slice(0, 20).map((record) => (
                                            <div
                                                key={record.id}
                                                className="flex items-center justify-between rounded-lg border p-4"
                                            >
                                                <div className="space-y-1">
                                                    <div className="font-medium">{record.class_name}</div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {new Date(record.attendance_date).toLocaleDateString('en-US', {
                                                            weekday: 'long',
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric'
                                                        })}
                                                    </div>
                                                    {record.remarks && (
                                                        <p className="text-sm text-muted-foreground">{record.remarks}</p>
                                                    )}
                                                </div>
                                                <Badge className={getAttendanceStatusColor(record.status)}>
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
