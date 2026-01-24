"use client"

import type React from "react"
import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Edit, Trash2, Mail, Hash, User } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from 'sonner'
import { cn } from "@/lib/utils"

interface Student {
  id: number
  firstName: string
  lastName: string
  email: string
  grade: number
  className: string
  status: string
}

interface StudentsTableProps {
  students: Student[]
  isLoading: boolean
  onAdd: (data: any) => Promise<{ success: boolean; error?: string }>
  onUpdate: (id: number, data: any) => Promise<{ success: boolean; error?: string }>
  onDelete: (id: number) => Promise<{ success: boolean; error?: string }>
}

export function StudentsTable({ students, isLoading, onAdd, onUpdate, onDelete }: StudentsTableProps) {
  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    grade: "",
    className: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const result = editingId ? await onUpdate(editingId, formData) : await onAdd(formData)
      if (result.success) {
        toast.success(`Records synchronized`)
        setOpen(false)
        setEditingId(null)
        setFormData({ firstName: "", lastName: "", email: "", grade: "", className: "" })
      } else {
        toast.error(result.error || `Failed to update record`)
      }
    } catch (error) {
      toast.error("Process interrupted")
    }
  }

  const handleDelete = async (id: number) => {
    if (window.confirm("Confirm deletion of this student profile?")) {
      const result = await onDelete(id)
      if (result.success) {
        toast.success("Profile purged from registry")
      } else {
        toast.error(result.error || "Execution failed")
      }
    }
  }

  const handleEdit = (student: Student) => {
    setEditingId(student.id)
    setFormData({
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email,
      grade: student.grade?.toString() || "",
      className: student.className || "",
    })
    setOpen(true)
  }

  if (isLoading) {
    return (
      <div className="p-12 text-center space-y-4">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-r-transparent"></div>
        <p className="text-slate-500 font-medium animate-pulse">Syncing student database...</p>
      </div>
    )
  }

  return (
    <div className="w-full">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-slate-900 border-slate-800 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold tracking-tight">Modify Student Profile</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-400">First Name</Label>
                <Input
                  className="bg-slate-800 border-slate-700"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-400">Last Name</Label>
                <Input
                  className="bg-slate-800 border-slate-700"
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
                className="bg-slate-800 border-slate-700"
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
                  className="bg-slate-800 border-slate-700"
                  value={formData.grade}
                  onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-400">Class Section</Label>
                <Input
                  className="bg-slate-800 border-slate-700"
                  value={formData.className}
                  onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                  required
                />
              </div>
            </div>
            <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 py-6 font-bold">
              Update Student Profile
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-slate-950/50">
            <TableRow className="border-slate-800 hover:bg-transparent">
              <TableHead className="text-slate-400 font-bold uppercase text-[10px] tracking-widest pl-6">Student Identification</TableHead>
              <TableHead className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Academic Info</TableHead>
              <TableHead className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">System Status</TableHead>
              <TableHead className="text-right text-slate-400 font-bold uppercase text-[10px] tracking-widest pr-6">Management</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.length === 0 ? (
              <TableRow className="border-slate-800">
                <TableCell colSpan={4} className="text-center py-20 text-slate-500 italic">
                  No personnel matching search criteria found in the system registry.
                </TableCell>
              </TableRow>
            ) : (
              students.map((student, index) => (
                <TableRow key={student.id || student.email || index} className="border-slate-800 hover:bg-slate-800/30 transition-colors group">
                  <TableCell className="pl-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 flex items-center justify-center text-indigo-400 font-bold shadow-inner">
                        {student.firstName[0]}{student.lastName[0]}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-white group-hover:text-indigo-400 transition-colors">{student.firstName} {student.lastName}</span>
                        <span className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                          <Mail className="h-3 w-3" />
                          {student.email}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 font-mono text-[10px]">GRADE {student.grade}</Badge>
                        <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20 font-mono text-[10px]">{student.className}</Badge>
                      </div>
                      <span className="text-[10px] text-slate-600 font-bold tracking-tighter uppercase">Enrolled Class Unit</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={cn("h-1.5 w-1.5 rounded-full animate-pulse", student.status === "Active" ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-slate-500")}></div>
                      <span className={cn("text-xs font-bold", student.status === "Active" ? "text-emerald-500" : "text-slate-500")}>{student.status}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(student)} className="h-8 w-8 text-slate-500 hover:text-white hover:bg-indigo-500/20">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-white hover:bg-slate-800">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-slate-900 border-slate-800 text-white">
                          <DropdownMenuLabel className="text-slate-500 text-[10px] uppercase">Record Management</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleEdit(student)} className="cursor-pointer">
                            <User className="mr-2 h-4 w-4 text-indigo-400" /> View Detailed Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">
                            <Hash className="mr-2 h-4 w-4 text-purple-400" /> Assign Roll Number
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-slate-800" />
                          <DropdownMenuItem className="text-rose-500 hover:text-rose-400 font-bold cursor-pointer" onClick={() => handleDelete(student.id)}>
                            <Trash2 className="mr-2 h-4 w-4" /> Terminate Access
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
