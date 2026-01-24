"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TeachersTable } from "@/components/teachers/teachers-table"
import { Plus, Search, UserPlus, Filter, Download, Briefcase, GraduationCap } from "lucide-react"
import { useTeachers } from "@/hooks/use-teachers"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { toast } from 'sonner'
import { cn } from "@/lib/utils"

export default function TeachersPage() {
  const [search, setSearch] = useState("")
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    department: "",
    subjects: "",
  })
  const { teachers, isLoading, addTeacher, updateTeacher, deleteTeacher } = useTeachers(1, search)

  const handleAddClick = () => {
    setFormData({ firstName: "", lastName: "", email: "", department: "", subjects: "" })
    setOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = await addTeacher(formData)
    if (result.success) {
      toast.success("Staff member registered")
      setOpen(false)
      setFormData({ firstName: "", lastName: "", email: "", department: "", subjects: "" })
    } else {
      toast.error('Registration failed')
    }
  }

  return (
    <div className="flex flex-col gap-8 p-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-indigo-400 text-sm font-bold uppercase tracking-widest">
            <Briefcase className="h-4 w-4" />
            <span>Personnel Management</span>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter">Educator Index</h1>
          <p className="text-slate-400 max-w-md">Oversee administrative and academic staff credentials and departmental assignments.</p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" className="bg-slate-900/50 border-slate-800 text-slate-300 hover:text-white">
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
          <Dialog open={open} onOpenChange={setOpen}>
            <Button onClick={handleAddClick} className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20">
              <UserPlus className="mr-2 h-4 w-4" />
              Recruit Educator
            </Button>
            <DialogContent className="bg-slate-900 border-slate-800 text-white shadow-2xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold tracking-tight">Staff Registration</DialogTitle>
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
                  <Label className="text-slate-400">Professional Email Address</Label>
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
                    <Label className="text-slate-400">Department</Label>
                    <Input
                      className="bg-slate-800 border-slate-700 focus:ring-indigo-500"
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-400">Assigned Subjects</Label>
                    <Input
                      className="bg-slate-800 border-slate-700 focus:ring-indigo-500"
                      value={formData.subjects}
                      onChange={(e) => setFormData({ ...formData, subjects: e.target.value })}
                      placeholder="Comma separated"
                      required
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 font-bold py-6">
                  Finalize Registration
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
            placeholder="Search by educator name, ID or specialization..."
            className="pl-11 bg-slate-950 border-slate-800 focus:ring-indigo-500/50 h-12 rounded-xl"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button variant="ghost" className="text-slate-400 hover:text-white hover:bg-slate-800">
          <Filter className="mr-2 h-4 w-4" /> Personnel Filter
        </Button>
      </div>

      <div className="bg-slate-900/50 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden backdrop-blur-xl">
        <TeachersTable
          teachers={teachers}
          isLoading={isLoading}
          onAdd={addTeacher}
          onUpdate={updateTeacher}
          onDelete={deleteTeacher}
        />
      </div>
    </div>
  )
}
