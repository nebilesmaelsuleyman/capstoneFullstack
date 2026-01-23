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
import { BookOpen, Calendar, GraduationCap, Plus, User, Users, Award, TrendingUp, Sparkles } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

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

export default function TeacherDashboard() {
    const [teacher, setTeacher] = useState<Teacher | null>(null)
    const [classes, setClasses] = useState<Class[]>([])
    const [students, setStudents] = useState<Student[]>([])
    const [selectedClass, setSelectedClass] = useState<Class | null>(null)
    const [selectedSubject, setSelectedSubject] = useState<string>("")
    const [grades, setGrades] = useState<Grade[]>([])
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

    useEffect(() => {
        const mockTeacherId = 1
        setTeacherId(mockTeacherId)
        fetchTeacherData(mockTeacherId)
    }, [])

    const fetchTeacherData = async (id: number) => {
        setLoading(true)
        try {
            const teacherRes = await fetch(`http://localhost:3001/teachers/${id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
            if (teacherRes.ok) {
                const teacherData = await teacherRes.json()
                setTeacher(teacherData)
            }

            const classesRes = await fetch(`http://localhost:3001/classes/teacher/${id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
            if (classesRes.ok) {
                const classesData = await classesRes.json()
                setClasses(classesData)
            }
        } catch (error) {
            console.error('Error fetching teacher data:', error)
        } finally {
            setLoading(false)
        }
    }

    const fetchStudentsByClass = async (classId: number) => {
        try {
            const res = await fetch(`http://localhost:3001/students/by-class/${classId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
            if (res.ok) {
                const data = await res.json()
                setStudents(data)
            }
        } catch (error) {
            console.error('Error fetching students:', error)
        }
    }

    const fetchGradesForClass = async (classId: number, subjectId: string) => {
        try {
            const res = await fetch(`http://localhost:3001/grades/class/${classId}/subject/${subjectId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
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
            const res = await fetch('http://localhost:3001/grades', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
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
            console.error('Error creating grade:', error)
        }
    }

    const handleClassSelect = (classItem: Class) => {
        setSelectedClass(classItem)
        setGrades([])
        setSelectedSubject("")
        setNewGrade({ ...newGrade, class_id: classItem.id.toString() })
        fetchStudentsByClass(classItem.id)
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
                    <p className="mt-2 text-sm text-slate-500">Preparing your teaching experience</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
            <div className="mx-auto max-w-7xl space-y-6">
                {/* Header with Gradient */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 p-8 shadow-2xl">
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="relative flex items-center justify-between">
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <Sparkles className="h-8 w-8 text-yellow-300 animate-pulse" />
                                <h1 className="text-4xl font-bold tracking-tight text-white">Teacher Dashboard</h1>
                            </div>
                            <p className="text-lg text-blue-100">
                                Welcome back, <span className="font-semibold">{teacher?.firstName} {teacher?.lastName}</span>
                            </p>
                            <p className="text-sm text-blue-200">{teacher?.department} • {teacher?.subjects}</p>
                        </div>
                        <Avatar className="h-20 w-20 border-4 border-white/30 shadow-xl">
                            <AvatarImage src="/placeholder-avatar.jpg" />
                            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-2xl font-bold text-white">
                                {teacher?.firstName?.[0]}{teacher?.lastName?.[0]}
                            </AvatarFallback>
                        </Avatar>
                    </div>
                </div>

                {/* Stats Cards with Glassmorphism */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card className="border-0 bg-gradient-to-br from-purple-500/10 to-purple-600/10 backdrop-blur-xl shadow-xl">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-purple-300">Total Classes</CardTitle>
                            <div className="rounded-full bg-purple-500/20 p-2">
                                <BookOpen className="h-5 w-5 text-purple-400" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-white">{classes.length}</div>
                            <p className="text-xs text-purple-300">Active classes</p>
                        </CardContent>
                    </Card>

                    <Card className="border-0 bg-gradient-to-br from-blue-500/10 to-blue-600/10 backdrop-blur-xl shadow-xl">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-blue-300">Total Students</CardTitle>
                            <div className="rounded-full bg-blue-500/20 p-2">
                                <Users className="h-5 w-5 text-blue-400" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-white">
                                {classes.reduce((sum, c) => sum + (parseInt(c.student_count?.toString() || '0')), 0)}
                            </div>
                            <p className="text-xs text-blue-300">Across all classes</p>
                        </CardContent>
                    </Card>

                    <Card className="border-0 bg-gradient-to-br from-cyan-500/10 to-cyan-600/10 backdrop-blur-xl shadow-xl">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-cyan-300">Department</CardTitle>
                            <div className="rounded-full bg-cyan-500/20 p-2">
                                <GraduationCap className="h-5 w-5 text-cyan-400" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-white">{teacher?.department || 'N/A'}</div>
                            <p className="text-xs text-cyan-300">{teacher?.subjects}</p>
                        </CardContent>
                    </Card>

                    <Card className="border-0 bg-gradient-to-br from-pink-500/10 to-pink-600/10 backdrop-blur-xl shadow-xl">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-pink-300">Employee ID</CardTitle>
                            <div className="rounded-full bg-pink-500/20 p-2">
                                <Award className="h-5 w-5 text-pink-400" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-white">{teacher?.employeeId || 'N/A'}</div>
                            <p className="text-xs text-pink-300">Staff identifier</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content Tabs */}
                <Tabs defaultValue="classes" className="space-y-4">
                    <TabsList className="grid w-full grid-cols-3 bg-slate-800/50 backdrop-blur-xl border border-slate-700">
                        <TabsTrigger value="classes" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white">
                            My Classes
                        </TabsTrigger>
                        <TabsTrigger value="grades" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white">
                            Manage Grades
                        </TabsTrigger>
                        <TabsTrigger value="profile" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white">
                            Profile
                        </TabsTrigger>
                    </TabsList>

                    {/* Classes Tab */}
                    <TabsContent value="classes" className="space-y-4">
                        <Card className="border-0 bg-slate-800/50 backdrop-blur-xl shadow-xl">
                            <CardHeader>
                                <CardTitle className="text-white">My Classes</CardTitle>
                                <CardDescription className="text-slate-400">Classes you are teaching this semester</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {classes.length === 0 ? (
                                    <div className="py-12 text-center">
                                        <BookOpen className="mx-auto h-12 w-12 text-slate-600" />
                                        <p className="mt-4 text-slate-400">No classes assigned</p>
                                    </div>
                                ) : (
                                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                        {classes.map((classItem, index) => (
                                            <Card key={classItem.id} className="group overflow-hidden border-0 bg-gradient-to-br from-slate-700/50 to-slate-800/50 backdrop-blur-xl transition-all hover:scale-105 hover:shadow-2xl">
                                                <div className="h-2 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500" />
                                                <CardHeader>
                                                    <div className="flex items-start justify-between">
                                                        <div>
                                                            <CardTitle className="text-lg text-white">{classItem.class_name}</CardTitle>
                                                            <CardDescription className="text-slate-400">{classItem.class_code}</CardDescription>
                                                        </div>
                                                        <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0">
                                                            Grade {classItem.grade_level}
                                                        </Badge>
                                                    </div>
                                                </CardHeader>
                                                <CardContent className="space-y-2">
                                                    <div className="flex items-center gap-2 text-sm text-slate-300">
                                                        <Users className="h-4 w-4 text-blue-400" />
                                                        <span>{classItem.student_count} Students</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm text-slate-300">
                                                        <BookOpen className="h-4 w-4 text-purple-400" />
                                                        <span>Room {classItem.room_number}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm text-slate-400">
                                                        <span>Section {classItem.section}</span>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Grades Tab */}
                    <TabsContent value="grades" className="space-y-4">
                        <Card className="border-0 bg-slate-800/50 backdrop-blur-xl shadow-xl">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-white">Manage Student Grades</CardTitle>
                                        <CardDescription className="text-slate-400">Create and view student grades</CardDescription>
                                    </div>
                                    <Dialog open={isGradeDialogOpen} onOpenChange={setIsGradeDialogOpen}>
                                        <DialogTrigger asChild>
                                            <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 shadow-lg">
                                                <Plus className="mr-2 h-4 w-4" />
                                                Add Grade
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-[525px] bg-slate-900 border-slate-700 text-white">
                                            <DialogHeader>
                                                <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                                                    Add New Grade
                                                </DialogTitle>
                                                <DialogDescription className="text-slate-400">
                                                    Enter the grade information for a student
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="grid gap-4 py-4">
                                                <div className="grid gap-2">
                                                    <Label htmlFor="class_id" className="text-slate-300">Class</Label>
                                                    <Select
                                                        value={newGrade.class_id}
                                                        onValueChange={(value) => {
                                                            setNewGrade({ ...newGrade, class_id: value })
                                                            fetchStudentsByClass(parseInt(value))
                                                        }}
                                                    >
                                                        <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                                                            <SelectValue placeholder="Select class" />
                                                        </SelectTrigger>
                                                        <SelectContent className="bg-slate-800 border-slate-700">
                                                            {classes.map((c) => (
                                                                <SelectItem key={c.id} value={c.id.toString()} className="text-white hover:bg-slate-700">
                                                                    {c.class_name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="student_id" className="text-slate-300">Student</Label>
                                                    <Select
                                                        value={newGrade.student_id}
                                                        onValueChange={(value) => setNewGrade({ ...newGrade, student_id: value })}
                                                        disabled={!newGrade.class_id}
                                                    >
                                                        <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                                                            <SelectValue placeholder={newGrade.class_id ? "Select student" : "Select class first"} />
                                                        </SelectTrigger>
                                                        <SelectContent className="bg-slate-800 border-slate-700">
                                                            {students.map((student) => (
                                                                <SelectItem key={student.id} value={student.id.toString()} className="text-white hover:bg-slate-700">
                                                                    {student.firstName} {student.lastName} ({student.student_id})
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="subject_id" className="text-slate-300">Subject ID</Label>
                                                    <Input
                                                        id="subject_id"
                                                        type="number"
                                                        value={newGrade.subject_id}
                                                        onChange={(e) => setNewGrade({ ...newGrade, subject_id: e.target.value })}
                                                        className="bg-slate-800 border-slate-700 text-white"
                                                    />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="exam_type" className="text-slate-300">Exam Type</Label>
                                                    <Select
                                                        value={newGrade.exam_type}
                                                        onValueChange={(value) => setNewGrade({ ...newGrade, exam_type: value })}
                                                    >
                                                        <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                                                            <SelectValue placeholder="Select exam type" />
                                                        </SelectTrigger>
                                                        <SelectContent className="bg-slate-800 border-slate-700">
                                                            <SelectItem value="midterm" className="text-white hover:bg-slate-700">Midterm</SelectItem>
                                                            <SelectItem value="final" className="text-white hover:bg-slate-700">Final</SelectItem>
                                                            <SelectItem value="quiz" className="text-white hover:bg-slate-700">Quiz</SelectItem>
                                                            <SelectItem value="assignment" className="text-white hover:bg-slate-700">Assignment</SelectItem>
                                                            <SelectItem value="project" className="text-white hover:bg-slate-700">Project</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="grid gap-2">
                                                        <Label htmlFor="grade" className="text-slate-300">Grade</Label>
                                                        <Input
                                                            id="grade"
                                                            type="number"
                                                            step="0.01"
                                                            value={newGrade.grade}
                                                            onChange={(e) => setNewGrade({ ...newGrade, grade: e.target.value })}
                                                            className="bg-slate-800 border-slate-700 text-white"
                                                        />
                                                    </div>
                                                    <div className="grid gap-2">
                                                        <Label htmlFor="max_grade" className="text-slate-300">Max Grade</Label>
                                                        <Input
                                                            id="max_grade"
                                                            type="number"
                                                            step="0.01"
                                                            value={newGrade.max_grade}
                                                            onChange={(e) => setNewGrade({ ...newGrade, max_grade: e.target.value })}
                                                            className="bg-slate-800 border-slate-700 text-white"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="exam_date" className="text-slate-300">Exam Date</Label>
                                                    <Input
                                                        id="exam_date"
                                                        type="date"
                                                        value={newGrade.exam_date}
                                                        onChange={(e) => setNewGrade({ ...newGrade, exam_date: e.target.value })}
                                                        className="bg-slate-800 border-slate-700 text-white"
                                                    />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="remarks" className="text-slate-300">Remarks (Optional)</Label>
                                                    <Input
                                                        id="remarks"
                                                        value={newGrade.remarks}
                                                        onChange={(e) => setNewGrade({ ...newGrade, remarks: e.target.value })}
                                                        className="bg-slate-800 border-slate-700 text-white"
                                                    />
                                                </div>
                                            </div>
                                            <DialogFooter>
                                                <Button variant="outline" onClick={() => setIsGradeDialogOpen(false)} className="border-slate-700 text-slate-300 hover:bg-slate-800">
                                                    Cancel
                                                </Button>
                                                <Button onClick={handleCreateGrade} className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0">
                                                    Add Grade
                                                </Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex gap-4">
                                        <Select
                                            value={selectedClass?.id.toString() || ""}
                                            onValueChange={(value) => {
                                                const classItem = classes.find(c => c.id.toString() === value)
                                                if (classItem) handleClassSelect(classItem)
                                            }}
                                        >
                                            <SelectTrigger className="w-[250px] bg-slate-800 border-slate-700 text-white">
                                                <SelectValue placeholder="Select a class" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-slate-800 border-slate-700">
                                                {classes.map((c) => (
                                                    <SelectItem key={c.id} value={c.id.toString()} className="text-white hover:bg-slate-700">
                                                        {c.class_name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {selectedClass && (
                                            <Input
                                                placeholder="Subject ID"
                                                value={selectedSubject}
                                                onChange={(e) => {
                                                    setSelectedSubject(e.target.value)
                                                    if (e.target.value && selectedClass) {
                                                        fetchGradesForClass(selectedClass.id, e.target.value)
                                                    }
                                                }}
                                                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                                            />
                                        )}
                                    </div>

                                    {grades.length === 0 ? (
                                        <div className="py-12 text-center">
                                            <GraduationCap className="mx-auto h-12 w-12 text-slate-600" />
                                            <p className="mt-4 text-slate-400">
                                                {selectedClass && selectedSubject
                                                    ? "No grades found for this class and subject"
                                                    : "Select a class and enter a subject ID to view grades"}
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            {grades.map((grade) => {
                                                const percentage = (grade.grade / grade.max_grade) * 100
                                                return (
                                                    <div
                                                        key={grade.id}
                                                        className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-800/50 p-4 transition-all hover:bg-slate-700/50"
                                                    >
                                                        <div className="space-y-1">
                                                            <div className="font-medium text-white">
                                                                {grade.first_name} {grade.last_name}
                                                            </div>
                                                            <div className="text-sm text-slate-400">
                                                                {grade.student_number} • {grade.email}
                                                            </div>
                                                            <div className="text-sm text-slate-500">
                                                                {grade.exam_type} • {new Date(grade.exam_date).toLocaleDateString()}
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className={`text-2xl font-bold ${percentage >= 90 ? 'text-green-400' :
                                                                    percentage >= 80 ? 'text-blue-400' :
                                                                        percentage >= 70 ? 'text-yellow-400' :
                                                                            percentage >= 60 ? 'text-orange-400' : 'text-red-400'
                                                                }`}>
                                                                {percentage.toFixed(1)}%
                                                            </div>
                                                            <div className="text-sm text-slate-400">
                                                                {grade.grade}/{grade.max_grade}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Profile Tab */}
                    <TabsContent value="profile" className="space-y-4">
                        <Card className="border-0 bg-slate-800/50 backdrop-blur-xl shadow-xl">
                            <CardHeader>
                                <CardTitle className="text-white">Teacher Profile</CardTitle>
                                <CardDescription className="text-slate-400">Your personal and professional information</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {teacher ? (
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-6">
                                            <Avatar className="h-24 w-24 border-4 border-purple-500/30 shadow-xl">
                                                <AvatarImage src="/placeholder-avatar.jpg" />
                                                <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-3xl font-bold text-white">
                                                    {teacher.firstName?.[0]}{teacher.lastName?.[0]}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <h3 className="text-2xl font-bold text-white">
                                                    {teacher.firstName} {teacher.lastName}
                                                </h3>
                                                <p className="text-slate-400">{teacher.email}</p>
                                            </div>
                                        </div>

                                        <div className="grid gap-4 md:grid-cols-2">
                                            <div className="space-y-2 rounded-lg bg-slate-700/30 p-4">
                                                <Label className="text-slate-400">Employee ID</Label>
                                                <p className="font-medium text-white">{teacher.employeeId}</p>
                                            </div>
                                            <div className="space-y-2 rounded-lg bg-slate-700/30 p-4">
                                                <Label className="text-slate-400">Department</Label>
                                                <p className="font-medium text-white">{teacher.department}</p>
                                            </div>
                                            <div className="space-y-2 rounded-lg bg-slate-700/30 p-4">
                                                <Label className="text-slate-400">Specialization</Label>
                                                <p className="font-medium text-white">{teacher.subjects}</p>
                                            </div>
                                            {teacher.phone && (
                                                <div className="space-y-2 rounded-lg bg-slate-700/30 p-4">
                                                    <Label className="text-slate-400">Phone</Label>
                                                    <p className="font-medium text-white">{teacher.phone}</p>
                                                </div>
                                            )}
                                            {teacher.qualification && (
                                                <div className="space-y-2 rounded-lg bg-slate-700/30 p-4 md:col-span-2">
                                                    <Label className="text-slate-400">Qualification</Label>
                                                    <p className="font-medium text-white">{teacher.qualification}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="py-12 text-center">
                                        <User className="mx-auto h-12 w-12 text-slate-600" />
                                        <p className="mt-4 text-slate-400">Profile information not available</p>
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
