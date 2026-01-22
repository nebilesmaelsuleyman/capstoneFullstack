"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ClipboardList, Plus, Calendar, Clock } from "lucide-react"

export default function ExamsPage() {
  const [open, setOpen] = useState(false)

  const exams = [
    {
      id: 1,
      name: "Mid-term Mathematics",
      type: "midterm",
      class: "Grade 9-A",
      subject: "Mathematics",
      date: "2024-03-15",
      duration: 120,
      totalMarks: 100,
    },
    {
      id: 2,
      name: "Final English Exam",
      type: "final",
      class: "Grade 10-A",
      subject: "English",
      date: "2024-04-20",
      duration: 90,
      totalMarks: 100,
    },
    {
      id: 3,
      name: "Science Quiz",
      type: "quiz",
      class: "Grade 9-B",
      subject: "Science",
      date: "2024-03-10",
      duration: 45,
      totalMarks: 50,
    },
  ]

  const results = [
    { id: 1, student: "John Smith", exam: "Mid-term Mathematics", marks: 85, grade: "A", percentage: 85 },
    { id: 2, student: "Emma Johnson", exam: "Mid-term Mathematics", marks: 92, grade: "A+", percentage: 92 },
    { id: 3, student: "Michael Brown", exam: "Mid-term Mathematics", marks: 78, grade: "B+", percentage: 78 },
    { id: 4, student: "Sarah Davis", exam: "Mid-term Mathematics", marks: 88, grade: "A", percentage: 88 },
  ]

  const getExamTypeBadge = (type: string) => {
    const variants: any = {
      midterm: "default",
      final: "destructive",
      quiz: "secondary",
      assignment: "outline",
    }
    return (
      <Badge variant={variants[type]} className="capitalize">
        {type}
      </Badge>
    )
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
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New Exam</DialogTitle>
              <DialogDescription>Add a new exam to the schedule</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="examName">Exam Name</Label>
                <Input id="examName" placeholder="Mid-term Mathematics" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="examType">Exam Type</Label>
                  <Select>
                    <SelectTrigger id="examType">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="midterm">Mid-term</SelectItem>
                      <SelectItem value="final">Final</SelectItem>
                      <SelectItem value="quiz">Quiz</SelectItem>
                      <SelectItem value="assignment">Assignment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Select>
                    <SelectTrigger id="subject">
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="math">Mathematics</SelectItem>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="science">Science</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="examDate">Date</Label>
                  <Input id="examDate" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (min)</Label>
                  <Input id="duration" type="number" placeholder="90" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="totalMarks">Total Marks</Label>
                <Input id="totalMarks" type="number" placeholder="100" />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setOpen(false)}>Create Exam</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Total Exams</p>
                <p className="font-bold text-2xl">24</p>
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
                <p className="font-bold text-2xl">5</p>
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
                <p className="font-bold text-2xl">19</p>
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
                <p className="font-bold text-2xl">84.5%</p>
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
                        <TableCell className="font-medium">{exam.name}</TableCell>
                        <TableCell>{getExamTypeBadge(exam.type)}</TableCell>
                        <TableCell>{exam.class}</TableCell>
                        <TableCell>{exam.subject}</TableCell>
                        <TableCell>{new Date(exam.date).toLocaleDateString()}</TableCell>
                        <TableCell>{exam.duration} min</TableCell>
                        <TableCell>{exam.totalMarks}</TableCell>
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
                        <TableCell className="font-medium">{result.student}</TableCell>
                        <TableCell>{result.exam}</TableCell>
                        <TableCell>{result.marks}/100</TableCell>
                        <TableCell>
                          <Badge variant="default">{result.grade}</Badge>
                        </TableCell>
                        <TableCell>{result.percentage}%</TableCell>
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
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
