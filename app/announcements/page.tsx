"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Megaphone, Plus, Calendar, AlertCircle, Bell, Trophy } from "lucide-react"

export default function AnnouncementsPage() {
  const [open, setOpen] = useState(false)

  const announcements = [
    {
      id: 1,
      title: "Welcome to New Academic Year",
      content:
        "We welcome all students and staff to the new academic year 2024-2025. Let us make this year successful together.",
      type: "general",
      priority: "high",
      audience: "all",
      date: "2024-01-05",
      postedBy: "Admin",
    },
    {
      id: 2,
      title: "Mid-term Exams Schedule",
      content:
        "Mid-term examinations will be conducted from March 15 to March 25. Please check your individual timetables for specific dates and times.",
      type: "academic",
      priority: "high",
      audience: "students",
      date: "2024-03-01",
      postedBy: "Admin",
    },
    {
      id: 3,
      title: "Parent-Teacher Meeting",
      content:
        "Parent-teacher meeting scheduled for next Saturday at 10 AM in the main hall. Your attendance is important.",
      type: "event",
      priority: "medium",
      audience: "parents",
      date: "2024-03-08",
      postedBy: "Principal",
    },
    {
      id: 4,
      title: "Sports Day 2024",
      content:
        "Annual Sports Day will be held on April 15, 2024. All students are encouraged to participate in various events.",
      type: "event",
      priority: "medium",
      audience: "all",
      date: "2024-03-20",
      postedBy: "Sports Department",
    },
    {
      id: 5,
      title: "Holiday Notice",
      content: "School will remain closed on March 25 due to public holiday. Classes will resume on March 26.",
      type: "holiday",
      priority: "low",
      audience: "all",
      date: "2024-03-22",
      postedBy: "Admin",
    },
  ]

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "general":
        return <Bell className="h-5 w-5" />
      case "academic":
        return <AlertCircle className="h-5 w-5" />
      case "event":
        return <Trophy className="h-5 w-5" />
      case "holiday":
        return <Calendar className="h-5 w-5" />
      default:
        return <Megaphone className="h-5 w-5" />
    }
  }

  const getTypeBadge = (type: string) => {
    const variants: any = {
      general: "default",
      academic: "destructive",
      event: "secondary",
      holiday: "outline",
      urgent: "destructive",
    }
    return (
      <Badge variant={variants[type]} className="capitalize">
        {type}
      </Badge>
    )
  }

  const getPriorityBadge = (priority: string) => {
    const variants: any = {
      high: "destructive",
      medium: "secondary",
      low: "outline",
    }
    return (
      <Badge variant={variants[priority]} className="capitalize">
        {priority}
      </Badge>
    )
  }

  return (
    <div className="flex flex-col gap-8 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-semibold text-3xl text-balance">Announcements</h1>
          <p className="text-muted-foreground">View and manage school announcements</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Announcement
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Announcement</DialogTitle>
              <DialogDescription>Post a new announcement for students, teachers, or parents</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" placeholder="Enter announcement title" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea id="content" placeholder="Enter announcement content" rows={4} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select>
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="academic">Academic</SelectItem>
                      <SelectItem value="event">Event</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                      <SelectItem value="holiday">Holiday</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select>
                    <SelectTrigger id="priority">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="audience">Target Audience</Label>
                <Select>
                  <SelectTrigger id="audience">
                    <SelectValue placeholder="Select audience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Everyone</SelectItem>
                    <SelectItem value="students">Students</SelectItem>
                    <SelectItem value="teachers">Teachers</SelectItem>
                    <SelectItem value="parents">Parents</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="expiresAt">Expires At (Optional)</Label>
                <Input id="expiresAt" type="datetime-local" />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setOpen(false)}>Publish</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Total</p>
                <p className="font-bold text-2xl">42</p>
              </div>
              <Megaphone className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Active</p>
                <p className="font-bold text-2xl">38</p>
              </div>
              <Bell className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">High Priority</p>
                <p className="font-bold text-2xl">8</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">This Month</p>
                <p className="font-bold text-2xl">12</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {announcements.map((announcement) => (
          <Card key={announcement.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-primary/10 p-2 text-primary">{getTypeIcon(announcement.type)}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-xl">{announcement.title}</CardTitle>
                      {getTypeBadge(announcement.type)}
                      {getPriorityBadge(announcement.priority)}
                    </div>
                    <CardDescription className="mt-2">
                      Posted by {announcement.postedBy} on {new Date(announcement.date).toLocaleDateString()} • For{" "}
                      {announcement.audience}
                    </CardDescription>
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  View Details
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{announcement.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
