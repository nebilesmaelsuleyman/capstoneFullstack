"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TeachersTable } from "@/components/teachers/teachers-table"
import { Plus, Search } from "lucide-react"
import { useTeachers } from "@/hooks/use-teachers"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {toast} from 'sonner'

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
  const { teachers, isLoading, addTeacher, updateTeacher , deleteTeacher } = useTeachers(1, search) 

  const handleAddClick = () => {
    setFormData({ firstName: "", lastName: "", email: "", department: "", subjects: "" })
    setOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = await addTeacher(formData)
    if (result.success) {
      toast.success("Teacher added successfully")
      setOpen(false)
      setFormData({ firstName: "", lastName: "", email: "", department: "", subjects: "" })
    } else {
      toast.error('failed to add teacher')
    }
  }

  return (
    <div className="flex flex-col gap-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-semibold text-3xl text-balance">Teachers</h1>
          <p className="text-muted-foreground">Manage teaching staff</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <Button onClick={handleAddClick}>
            <Plus className="mr-2 h-4 w-4" />
            Add Teacher
          </Button>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Teacher</DialogTitle>
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
                Add Teacher
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search teachers..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <TeachersTable
        teachers={teachers}
        isLoading={isLoading}
        onAdd={addTeacher}
        onUpdate={updateTeacher}
        onDelete={deleteTeacher}
      />
    </div>
  )
}
