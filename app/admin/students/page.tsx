"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { StudentsTable } from "@/components/students/students-table"
import { Plus, Search, UserPlus, Filter, Download, GraduationCap } from "lucide-react"
import { useStudents } from "@/hooks/use-students"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

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

  const handleAddClick = () => {
    setFormData({ firstName: "", lastName: "", email: "", grade: "", className: "" })
    setOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload = { ...formData };
    const result = await addStudent(payload)
    if (result.success) {
      toast.success("Student records updated")
      setOpen(false)
      setFormData({ firstName: "", lastName: "", email: "", grade: "", className: "" })
    } else {
      toast.error('Operation failed')
    }
  }

  return (
    <div className="flex flex-col gap-8 p-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-indigo-400 text-sm font-bold uppercase tracking-widest">
            <GraduationCap className="h-4 w-4" />
            <span>Academic Management</span>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter">Student Directory</h1>
          <p className="text-slate-400 max-w-md">Access, modify, and manage all registered student profiles within the system.</p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" className="bg-slate-900/50 border-slate-800 text-slate-300 hover:text-white">
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
          <Dialog open={open} onOpenChange={setOpen}>
            <Button onClick={handleAddClick} className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20">
              <UserPlus className="mr-2 h-4 w-4" />
              Enroll New Student
            </Button>

            <DialogContent className="bg-slate-900 border-slate-800 text-white shadow-2xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold tracking-tight">Student Enrollment</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-slate-400">First Name</Label>
                    <Input
                      className="bg-slate-800 border-slate-700 focus:ring-indigo-500"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-400">Last Name</Label>
                    <Input
                      className="bg-slate-800 border-slate-700 focus:ring-indigo-500"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-400">Institutional Email</Label>
                  <Input
                    type="email"
                    className="bg-slate-800 border-slate-700 focus:ring-indigo-500"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-slate-400">Grade Level</Label>
                    <Input
                      type="number"
                      className="bg-slate-800 border-slate-700 focus:ring-indigo-500"
                      value={formData.grade}
                      onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-400">Class Section</Label>
                    <Input
                      className="bg-slate-800 border-slate-700 focus:ring-indigo-500"
                      value={formData.className}
                      onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 font-bold py-6">
                  Enroll Student
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-4 bg-slate-900/30 p-4 rounded-2xl border border-slate-800 backdrop-blur-sm">
        <div className="relative flex-1 w-full">
          <Search className="-translate-y-1/2 absolute top-1/2 left-4 h-4 w-4 text-slate-500" />
          <Input
            placeholder="Search by name, ID or email..."
            className="pl-11 bg-slate-950 border-slate-800 focus:ring-indigo-500/50 h-12 rounded-xl"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button variant="ghost" className="text-slate-400 hover:text-white hover:bg-slate-800">
          <Filter className="mr-2 h-4 w-4" /> Advanced Filters
        </Button>
      </div>

      <div className="bg-slate-900/50 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden backdrop-blur-xl">
        <StudentsTable
          students={students}
          isLoading={isLoading}
          onAdd={addStudent}
          onUpdate={updateStudent}
          onDelete={deleteStudent}
        />
      </div>
    </div>
  )
}
