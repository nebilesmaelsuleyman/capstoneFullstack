"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { StudentsTable } from "@/components/students/students-table"
import { Plus, Search } from "lucide-react"
import { useStudents } from "@/hooks/use-students"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

export default function StudentsPage() {
  const [search, setSearch] = useState("")
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    grade: "",
    className: "",
  })
  const { students, isLoading, addStudent, updateStudent, deleteStudent } = useStudents(1, search)
  const { toast } = useToast()

  const handleAddClick = () => {
    setFormData({ firstName: "", lastName: "", email: "", grade: "", className: "" })
    setOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("submitting student:", formData)
    const result = await addStudent(formData)
    console.log("Add student result:", result)
    if (result.success) {
      toast({
        title: "Success",
        description: "Student added successfully",
      })
      setOpen(false)
      setFormData({ firstName: "", lastName: "", email: "", grade: "", className: "" })
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to add student",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex flex-col gap-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-semibold text-3xl text-balance">Students</h1>
          <p className="text-muted-foreground">Manage your student database</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <Button onClick={handleAddClick} >
            <Plus className="mr-2 h-4 w-4" />
            Add Student
          </Button>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Student</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>First Name</Label>
                  <Input
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Last Name</Label>
                  <Input
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Grade</Label>
                  <Input
                    type="number"
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Class</Label>
                  <Input
                    value={formData.className}
                    onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full" >
                Add Student
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search students..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <StudentsTable
        students={students}
        isLoading={isLoading}
        onAdd={addStudent}
        onUpdate={updateStudent}
        onDelete={deleteStudent}
      />
    </div>
  )
}
