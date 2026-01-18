"use client"

import type React from "react"

import { useState, useEffect } from "react"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Plus, Search, MoreHorizontal, BookOpen } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { apiClient } from "@/lib/api-client"

interface Grade {
  id: number
  studentName: string
  subjectName: string
  examType: string
  grade: number
  maxGrade: number
  percentage: number
  examDate: string
  remarks: string
}

export default function GradesPage() {
  const [grades, setGrades] = useState<Grade[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [search, setSearch] = useState("")
  const [formData, setFormData] = useState({
    studentId: "",
    subjectId: "",
    examType: "midterm",
    grade: "",
    maxGrade: "100",
    examDate: "",
    remarks: "",
  })
  const { toast } = useToast()

  useEffect(() => {
    setIsLoading(false)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (editingId) {
        const response = await apiClient.updateGrade(editingId, formData)
        if (!response.error) {
          toast({
            title: "Success",
            description: "Grade updated successfully",
          })
          setGrades(grades.map((g) => (g.id === editingId ? response.data : g)))
        } else {
          toast({
            title: "Error",
            description: response.error,
            variant: "destructive",
          })
        }
      } else {
        const response = await apiClient.createGrade(formData)
        if (!response.error) {
          toast({
            title: "Success",
            description: "Grade added successfully",
          })
          setGrades([...grades, response.data])
        } else {
          toast({
            title: "Error",
            description: response.error,
            variant: "destructive",
          })
        }
      }
      setOpen(false)
      setEditingId(null)
      setFormData({
        studentId: "",
        subjectId: "",
        examType: "midterm",
        grade: "",
        maxGrade: "100",
        examDate: "",
        remarks: "",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this grade?")) {
      const response = await apiClient.deleteGrade(id)
      if (!response.error) {
        toast({
          title: "Success",
          description: "Grade deleted successfully",
        })
        setGrades(grades.filter((g) => g.id !== id))
      } else {
        toast({
          title: "Error",
          description: response.error,
          variant: "destructive",
        })
      }
    }
  }

  const handleEdit = (grade: Grade) => {
    setEditingId(grade.id)
    setFormData({
      studentId: grade.studentName,
      subjectId: grade.subjectName,
      examType: grade.examType,
      grade: grade.grade.toString(),
      maxGrade: grade.maxGrade.toString(),
      examDate: grade.examDate,
      remarks: grade.remarks,
    })
    setOpen(true)
  }

  const getGradeBadge = (percentage: number) => {
    if (percentage >= 90) return <Badge className="bg-emerald-500">A+</Badge>
    if (percentage >= 80) return <Badge className="bg-green-500">A</Badge>
    if (percentage >= 70) return <Badge className="bg-blue-500">B</Badge>
    if (percentage >= 60) return <Badge className="bg-yellow-500">C</Badge>
    return <Badge className="bg-red-500">F</Badge>
  }

  const sampleGrades: Grade[] = [
    {
      id: 1,
      studentName: "Ali Khan",
      subjectName: "Mathematics",
      examType: "midterm",
      grade: 85,
      maxGrade: 100,
      percentage: 85,
      examDate: "2024-03-15",
      remarks: "Good performance",
    },
    {
      id: 2,
      studentName: "Fatima Ahmed",
      subjectName: "English",
      examType: "quiz",
      grade: 92,
      maxGrade: 100,
      percentage: 92,
      examDate: "2024-03-10",
      remarks: "Excellent",
    },
  ]

  return (
    <div className="flex flex-col gap-8 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-semibold text-3xl text-balance">Grades & Marks</h1>
          <p className="text-muted-foreground">Manage student grades and exam results</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Grade
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Grade" : "Add New Grade"}</DialogTitle>
              <DialogDescription>
                {editingId ? "Update student grade information" : "Enter student grade for an exam"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="studentId">Student</Label>
                  <Select
                    value={formData.studentId}
                    onValueChange={(value) => setFormData({ ...formData, studentId: value })}
                  >
                    <SelectTrigger id="studentId">
                      <SelectValue placeholder="Select student" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Ali Khan</SelectItem>
                      <SelectItem value="2">Fatima Ahmed</SelectItem>
                      <SelectItem value="3">Hassan Ali</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subjectId">Subject</Label>
                  <Select
                    value={formData.subjectId}
                    onValueChange={(value) => setFormData({ ...formData, subjectId: value })}
                  >
                    <SelectTrigger id="subjectId">
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Mathematics</SelectItem>
                      <SelectItem value="2">English</SelectItem>
                      <SelectItem value="3">Science</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="examType">Exam Type</Label>
                  <Select
                    value={formData.examType}
                    onValueChange={(value) => setFormData({ ...formData, examType: value })}
                  >
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
                  <Label htmlFor="examDate">Exam Date</Label>
                  <Input
                    id="examDate"
                    type="date"
                    value={formData.examDate}
                    onChange={(e) => setFormData({ ...formData, examDate: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="grade">Marks Obtained</Label>
                  <Input
                    id="grade"
                    type="number"
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                    placeholder="85"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxGrade">Total Marks</Label>
                  <Input
                    id="maxGrade"
                    type="number"
                    value={formData.maxGrade}
                    onChange={(e) => setFormData({ ...formData, maxGrade: e.target.value })}
                    placeholder="100"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="remarks">Remarks (Optional)</Label>
                <Input
                  id="remarks"
                  value={formData.remarks}
                  onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                  placeholder="Good performance, needs improvement..."
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">{editingId ? "Update" : "Add"} Grade</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Total Grades Entered</p>
                <p className="font-bold text-2xl">148</p>
              </div>
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Average Score</p>
                <p className="font-bold text-2xl">84.2%</p>
              </div>
              <div className="text-2xl">📊</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Top Performer</p>
                <p className="font-bold text-2xl">95%</p>
              </div>
              <div className="text-2xl">🏆</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Needs Improvement</p>
                <p className="font-bold text-2xl">12</p>
              </div>
              <div className="text-2xl">⚠️</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Grade Records</CardTitle>
              <CardDescription>All student grades and exam marks</CardDescription>
            </div>
            <div className="relative">
              <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search grades..."
                className="pl-9 w-64"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Exam Type</TableHead>
                  <TableHead>Marks</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Percentage</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sampleGrades.map((grade) => (
                  <TableRow key={grade.id}>
                    <TableCell className="font-medium">{grade.studentName}</TableCell>
                    <TableCell>{grade.subjectName}</TableCell>
                    <TableCell>
                      <Badge>{grade.examType}</Badge>
                    </TableCell>
                    <TableCell>
                      {grade.grade}/{grade.maxGrade}
                    </TableCell>
                    <TableCell>{getGradeBadge(grade.percentage)}</TableCell>
                    <TableCell>{grade.percentage}%</TableCell>
                    <TableCell>{grade.examDate}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleEdit(grade)}>Edit</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(grade.id)}>
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
