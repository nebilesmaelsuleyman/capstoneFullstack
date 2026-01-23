"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ClipboardList, Plus, Calendar, Clock, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Exam {
  id: number
  exam_name: string
  exam_type: string
  subject_name: string
  class_name: string
  section: string
  exam_date: string
  duration_minutes: number
  total_marks: number
  description?: string
}

interface Class {
  id: number
  class_name: string
  class_code: string
  section: string
}

interface Subject {
  id: number
  subject_name: string
  subject_code: string
}

interface ExamResult {
  id: number
  first_name: string
  last_name: string
  roll_number: string
  marks_obtained: number
  grade_letter: string
  exam_name: string
  total_marks: number
}

export default function ExamsPage() {
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [exams, setExams] = useState<Exam[]>([])
  const [classes, setClasses] = useState<Class[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [results, setResults] = useState<ExamResult[]>([])
  const [newExam, setNewExam] = useState({
    examName: "",
    examType: "",
    subjectId: "",
    classId: "",
    examDate: "",
    totalMarks: "100",
    durationMinutes: "90",
    description: ""
  })

  useEffect(() => {
    fetchExams()
    fetchClasses()
    fetchSubjects()
  }, [])

  const fetchExams = async () => {
    setLoading(true)
    try {
      const res = await fetch('http://localhost:4000/api/exams', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (res.ok) {
        const data = await res.json()
        setExams(data.data || data)
      }
    } catch (error) {
      console.error('Error fetching exams:', error)
    } finally {
      setLoading(false)
    }
  }

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
    }
  }

  const fetchSubjects = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/subjects', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
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

  const handleCreateExam = async () => {
    if (!newExam.examName || !newExam.examType || !newExam.subjectId || !newExam.classId || !newExam.examDate) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      })
      return
    }

    setSaving(true)
    try {
      const res = await fetch('http://localhost:4000/api/exams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          examName: newExam.examName,
          examType: newExam.examType,
          subjectId: parseInt(newExam.subjectId),
          classId: parseInt(newExam.classId),
          examDate: newExam.examDate,
          totalMarks: parseFloat(newExam.totalMarks),
          durationMinutes: parseInt(newExam.durationMinutes),
          description: newExam.description
        })
      })

      if (res.ok) {
        toast({
          title: "Success",
          description: "Exam created successfully",
        })
        setOpen(false)
        setNewExam({
          examName: "",
          examType: "",
          subjectId: "",
          classId: "",
          examDate: "",
          totalMarks: "100",
          durationMinutes: "90",
          description: ""
        })
        fetchExams()
      } else {
        throw new Error('Failed to create exam')
      }
    } catch (error) {
      console.error('Error creating exam:', error)
      toast({
        title: "Error",
        description: "Failed to create exam",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  const getExamTypeBadge = (type: string) => {
    const variants: any = {
      midterm: "default",
      final: "destructive",
      quiz: "secondary",
      assignment: "outline",
      project: "outline"
    }
    return (
      <Badge variant={variants[type]} className="capitalize">
        {type}
      </Badge>
    )
  }

  const stats = {
    total: exams.length,
    upcoming: exams.filter(e => new Date(e.exam_date) > new Date()).length,
    completed: exams.filter(e => new Date(e.exam_date) <= new Date()).length,
    averageScore: 84.5
  }

  return (
    <div className="flex flex-col gap-8 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-semibold text-3xl text-balance">Exams & Results</h1>
          <p className="text-muted-foreground">Manage exams and track student performance</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Exam
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Create New Exam</DialogTitle>
              <DialogDescription>Add a new exam to the schedule</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="examName">Exam Name *</Label>
                <Input
                  id="examName"
                  placeholder="Mid-term Mathematics"
                  value={newExam.examName}
                  onChange={(e) => setNewExam({ ...newExam, examName: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="examType">Exam Type *</Label>
                  <Select value={newExam.examType} onValueChange={(value) => setNewExam({ ...newExam, examType: value })}>
                    <SelectTrigger id="examType">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="midterm">Mid-term</SelectItem>
                      <SelectItem value="final">Final</SelectItem>
                      <SelectItem value="quiz">Quiz</SelectItem>
                      <SelectItem value="assignment">Assignment</SelectItem>
                      <SelectItem value="project">Project</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject *</Label>
                  <Select value={newExam.subjectId} onValueChange={(value) => setNewExam({ ...newExam, subjectId: value })}>
                    <SelectTrigger id="subject">
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((subject) => (
                        <SelectItem key={subject.id} value={subject.id.toString()}>
                          {subject.subject_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="class">Class *</Label>
                <Select value={newExam.classId} onValueChange={(value) => setNewExam({ ...newExam, classId: value })}>
                  <SelectTrigger id="class">
                    <SelectValue placeholder="Select class" />
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
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="examDate">Date *</Label>
                  <Input
                    id="examDate"
                    type="date"
                    value={newExam.examDate}
                    onChange={(e) => setNewExam({ ...newExam, examDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (min)</Label>
                  <Input
                    id="duration"
                    type="number"
                    placeholder="90"
                    value={newExam.durationMinutes}
                    onChange={(e) => setNewExam({ ...newExam, durationMinutes: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="totalMarks">Total Marks</Label>
                <Input
                  id="totalMarks"
                  type="number"
                  placeholder="100"
                  value={newExam.totalMarks}
                  onChange={(e) => setNewExam({ ...newExam, totalMarks: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Additional details about the exam..."
                  value={newExam.description}
                  onChange={(e) => setNewExam({ ...newExam, description: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateExam} disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Exam
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Total Exams</p>
                <p className="font-bold text-2xl">{stats.total}</p>
              </div>
              <ClipboardList className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Upcoming</p>
                <p className="font-bold text-2xl">{stats.upcoming}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Completed</p>
                <p className="font-bold text-2xl">{stats.completed}</p>
              </div>
              <Clock className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Average Score</p>
                <p className="font-bold text-2xl">{stats.averageScore}%</p>
              </div>
              <ClipboardList className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="exams" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="exams">Exam Schedule</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
        </TabsList>

        <TabsContent value="exams" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Exams</CardTitle>
              <CardDescription>View and manage upcoming exams</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : exams.length > 0 ? (
                <div className="rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Exam Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Class</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Total Marks</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {exams.map((exam) => (
                        <TableRow key={exam.id}>
                          <TableCell className="font-medium">{exam.exam_name}</TableCell>
                          <TableCell>{getExamTypeBadge(exam.exam_type)}</TableCell>
                          <TableCell>{exam.class_name} - {exam.section}</TableCell>
                          <TableCell>{exam.subject_name}</TableCell>
                          <TableCell>{new Date(exam.exam_date).toLocaleDateString()}</TableCell>
                          <TableCell>{exam.duration_minutes} min</TableCell>
                          <TableCell>{exam.total_marks}</TableCell>
                          <TableCell>
                            <Button size="sm" variant="outline">
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="py-12 text-center text-muted-foreground">
                  No exams scheduled yet. Create your first exam!
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Exam Results</CardTitle>
              <CardDescription>Student performance and grades</CardDescription>
            </CardHeader>
            <CardContent>
              {results.length > 0 ? (
                <div className="rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student Name</TableHead>
                        <TableHead>Exam</TableHead>
                        <TableHead>Marks Obtained</TableHead>
                        <TableHead>Grade</TableHead>
                        <TableHead>Percentage</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {results.map((result) => (
                        <TableRow key={result.id}>
                          <TableCell className="font-medium">
                            {result.first_name} {result.last_name}
                          </TableCell>
                          <TableCell>{result.exam_name}</TableCell>
                          <TableCell>{result.marks_obtained}/{result.total_marks}</TableCell>
                          <TableCell>
                            <Badge variant="default">{result.grade_letter}</Badge>
                          </TableCell>
                          <TableCell>
                            {((result.marks_obtained / result.total_marks) * 100).toFixed(1)}%
                          </TableCell>
                          <TableCell>
                            <Button size="sm" variant="outline">
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="py-12 text-center text-muted-foreground">
                  No results available yet
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
