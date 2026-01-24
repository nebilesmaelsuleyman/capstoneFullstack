"use client"

import type React from "react"
import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Edit, Trash2, Mail, Briefcase, GraduationCap, MapPin } from "lucide-react"
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

interface Teacher {
  id: number
  firstName: string
  lastName: string
  email: string
  department: string
  subjects: string
  status: string
}

interface TeachersTableProps {
  teachers: Teacher[]
  isLoading: boolean
  onAdd: (data: any) => Promise<{ success: boolean; error?: string }>
  onUpdate: (id: number, data: any) => Promise<{ success: boolean; error?: string }>
  onDelete: (id: number) => Promise<{ success: boolean; error?: string }>
}

export function TeachersTable({ teachers, isLoading, onAdd, onUpdate, onDelete }: TeachersTableProps) {
  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    department: "",
    subjects: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const result = editingId ? await onUpdate(editingId, formData) : await onAdd(formData)
      if (result.success) {
        toast.success(`Personnel files updated`)
        setOpen(false)
        setEditingId(null)
        setFormData({ firstName: "", lastName: "", email: "", department: "", subjects: "" })
      } else {
        toast.error(result.error || `Update failed`)
      }
    } catch (error) {
      toast.error('System processing error')
    }
  }

  const handleDelete = async (id: number) => {
    if (window.confirm("Permamently remove this educator from the registry?")) {
      const result = await onDelete(id)
      if (result.success) {
        toast.success("Personnel record archived")
      } else {
        toast.error(result.error || "Archival process failed")
      }
    }
  }

  const handleEdit = (teacher: Teacher) => {
    setEditingId(teacher.id)
    setFormData({
      firstName: teacher.firstName,
      lastName: teacher.lastName,
      email: teacher.email,
      department: teacher.department,
      subjects: teacher.subjects,
    })
    setOpen(true)
  }

  if (isLoading) {
    return (
      <div className="p-12 text-center space-y-4">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-r-transparent"></div>
        <p className="text-slate-500 font-medium animate-pulse">Accessing personnel vault...</p>
      </div>
    )
  }

  return (
    <div className="w-full">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-slate-900 border-slate-800 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold tracking-tight">Modify Staff Profile</DialogTitle>
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
              <Label className="text-slate-400">Professional Email</Label>
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
                <Label className="text-slate-400">Department</Label>
                <Input
                  className="bg-slate-800 border-slate-700"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-400">Assigned Subjects</Label>
                <Input
                  className="bg-slate-800 border-slate-700"
                  value={formData.subjects}
                  onChange={(e) => setFormData({ ...formData, subjects: e.target.value })}
                  placeholder="Comma separated"
                  required
                />
              </div>
            </div>
            <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 py-6 font-bold">
              Update Personnel Records
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-slate-950/50">
            <TableRow className="border-slate-800 hover:bg-transparent">
              <TableHead className="text-slate-400 font-bold uppercase text-[10px] tracking-widest pl-6">Educator Profile</TableHead>
              <TableHead className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Departmental Hub</TableHead>
              <TableHead className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Specializations</TableHead>
              <TableHead className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Status</TableHead>
              <TableHead className="text-right text-slate-400 font-bold uppercase text-[10px] tracking-widest pr-6">Commands</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teachers.length === 0 ? (
              <TableRow className="border-slate-800">
                <TableCell colSpan={5} className="text-center py-20 text-slate-500 italic">
                  No educators currently matched in the institutional database.
                </TableCell>
              </TableRow>
            ) : (
              teachers.map((teacher) => (
                <TableRow key={teacher.id} className="border-slate-800 hover:bg-slate-800/30 transition-colors group">
                  <TableCell className="pl-6 py-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12 border-2 border-slate-800 ring-2 ring-transparent group-hover:ring-indigo-500 transition-all duration-300">
                        <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-black text-sm">
                          {`${teacher.firstName?.[0] || ""}${teacher.lastName?.[0] || ""}`}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-bold text-white group-hover:text-indigo-400 transition-colors">{teacher.firstName} {teacher.lastName}</span>
                        <span className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5 lowercase">
                          <Mail className="h-3 w-3" />
                          {teacher.email}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        <Briefcase className="h-4 w-4" />
                      </div>
                      <span className="font-bold text-sm text-slate-300">{teacher.department}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1.5 max-w-[200px]">
                      {(teacher.subjects || "N/A").split(",").map((subject) => (
                        <Badge key={subject.trim()} className="bg-slate-800 text-slate-300 border-slate-700 text-[9px] px-1.5 py-0">
                          {subject.trim()}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={cn("h-1.5 w-1.5 rounded-full animate-pulse", teacher.status === "Active" ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-slate-500")}></div>
                      <span className={cn("text-xs font-bold", teacher.status === "Active" ? "text-emerald-500" : "text-slate-500")}>{teacher.status}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(teacher)} className="h-8 w-8 text-slate-500 hover:text-white hover:bg-slate-800">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-white hover:bg-slate-800">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-slate-900 border-slate-800 text-white">
                          <DropdownMenuLabel className="text-slate-500 text-[10px] uppercase">Personnel Ops</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleEdit(teacher)} className="cursor-pointer">
                            <GraduationCap className="mr-2 h-4 w-4 text-indigo-400" /> Administrative View
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">
                            <MapPin className="mr-2 h-4 w-4 text-purple-400" /> Assign Office
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-slate-800" />
                          <DropdownMenuItem className="text-rose-500 hover:text-rose-400 font-bold cursor-pointer" onClick={() => handleDelete(teacher.id)}>
                            <Trash2 className="mr-2 h-4 w-4" /> Terminate Contract
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
