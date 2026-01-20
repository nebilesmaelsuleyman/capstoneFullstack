"use client"

import type React from "react"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
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
import {toast} from 'sonner'

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
        toast.success(`Teacher ${editingId ? "updated" : "added"} successfully`)
        setOpen(false)
        setEditingId(null)
        setFormData({ firstName: "", lastName: "", email: "", department: "", subjects: "" })
      } else {
        toast.error(result.error || `Failed to ${editingId ? "update" : "add"} teacher`)
      }
    } catch (error) {
      toast.error('An unexpected error occurred')
    }
  }

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this teacher?")) {
      const result = await onDelete(id)
      if (result.success) {
        toast.success("Teacher deleted successfully")
      } else {
        toast.error(result.error || "Failed to delete teacher")
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
    return <div className="rounded-lg border border-border bg-card p-8 text-center">Loading teachers...</div>
  }

  return (
    <div className="rounded-lg border border-border bg-card">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Teacher" : "Add New Teacher"}</DialogTitle>
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
                <Label>Department</Label>
                <Input
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Subjects</Label>
                <Input
                  value={formData.subjects}
                  onChange={(e) => setFormData({ ...formData, subjects: e.target.value })}
                  placeholder="Comma separated"
                  required
                />
              </div>
            </div>
            <Button type="submit" className="w-full">
              {editingId ? "Update" : "Add"} Teacher
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Teacher</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Subjects</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {teachers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                No teachers found
              </TableCell>
            </TableRow>
          ) : (
            teachers.map((teacher) => (
              <TableRow key={teacher.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-secondary text-xs">
                        {`${teacher.firstName ||"" }${teacher.lastName ||""}`}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{`${teacher.firstName} ${teacher.lastName}`}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{teacher.email}</TableCell>
                <TableCell>{teacher.department}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {(teacher.subjects || "").split(",").map((subject) => (
                      <Badge key={subject.trim()} variant="outline" className="text-xs">
                        {subject.trim()}
                      </Badge>
                    )) || "NO subjects"}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={teacher.status === "Active" ? "default" : "secondary"}>{teacher.status}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => handleEdit(teacher)}>Edit Teacher</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(teacher.id)}>
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
