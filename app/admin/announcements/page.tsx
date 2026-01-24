"use client"

import { useState, useEffect } from "react"
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
import { Megaphone, Plus, Calendar, AlertCircle, Bell, Trophy, Trash2, Loader2, Target } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface Announcement {
  id: number
  title: string
  content: string
  announcement_type: string
  target_audience: string
  posted_by: number
  priority: string
  posted_at: string
  expires_at: string | null
  posted_by_first_name?: string
  posted_by_last_name?: string
}

export default function AnnouncementsPage() {
  const [open, setOpen] = useState(false)
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    announcementType: "general",
    targetAudience: "all",
    priority: "medium",
    expiresAt: "",
  })

  const fetchAnnouncements = async () => {
    setLoading(true)
    try {
      const response = await fetch("http://localhost:4000/api/announcements", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      })
      if (!response.ok) throw new Error("Failed to fetch announcements")
      const data = await response.json()
      setAnnouncements(data.data)
    } catch (error) {
      console.error(error)
      toast.error("Failed to load announcements")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnnouncements()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const response = await fetch("http://localhost:4000/api/announcements", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error("Failed to create announcement")

      toast.success("Announcement published successfully")
      setOpen(false)
      setFormData({
        title: "",
        content: "",
        announcementType: "general",
        targetAudience: "all",
        priority: "medium",
        expiresAt: "",
      })
      fetchAnnouncements()
    } catch (error) {
      console.error(error)
      toast.error("Failed to publish announcement")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this announcement?")) return

    try {
      const response = await fetch(`http://localhost:4000/api/announcements/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      })

      if (!response.ok) throw new Error("Failed to delete announcement")

      toast.success("Announcement deleted")
      fetchAnnouncements()
    } catch (error) {
      console.error(error)
      toast.error("Failed to delete announcement")
    }
  }

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
    <div className="flex flex-col gap-8 p-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-indigo-400 text-sm font-bold uppercase tracking-widest">
            <Megaphone className="h-4 w-4" />
            <span>Institutional Broadcast</span>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter">Announcements</h1>
          <p className="text-slate-400 max-w-md">Distribute critical updates, academic notifications, and event alerts across the institutional network.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20">
              <Plus className="mr-2 h-4 w-4" />
              New Broadcast
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] bg-slate-900 border-slate-800 text-white shadow-2xl">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold tracking-tight text-white">Broadcast Protocol</DialogTitle>
                <DialogDescription className="text-slate-400 font-medium">Configure and dispatch a system-wide announcement.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-slate-400 text-[10px] uppercase font-bold">Protocol Title</Label>
                  <Input
                    id="title"
                    className="bg-slate-800 border-slate-700 focus:ring-indigo-500 text-white"
                    placeholder="Enter announcement title"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content" className="text-slate-400 text-[10px] uppercase font-bold">Intelligence Brief</Label>
                  <Textarea
                    id="content"
                    className="bg-slate-800 border-slate-700 focus:ring-indigo-500 text-white"
                    placeholder="Enter announcement content"
                    rows={4}
                    required
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type" className="text-slate-400 text-[10px] uppercase font-bold">Category</Label>
                    <Select
                      value={formData.announcementType}
                      onValueChange={(val) => setFormData({ ...formData, announcementType: val })}
                    >
                      <SelectTrigger id="type" className="bg-slate-800 border-slate-700">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-slate-800 text-white">
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="academic">Academic</SelectItem>
                        <SelectItem value="event">Event</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                        <SelectItem value="holiday">Holiday</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priority" className="text-slate-400 text-[10px] uppercase font-bold">Priority Level</Label>
                    <Select
                      value={formData.priority}
                      onValueChange={(val) => setFormData({ ...formData, priority: val })}
                    >
                      <SelectTrigger id="priority" className="bg-slate-800 border-slate-700">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-slate-800 text-white">
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="audience" className="text-slate-400 text-[10px] uppercase font-bold">Target Audience</Label>
                  <Select
                    value={formData.targetAudience}
                    onValueChange={(val) => setFormData({ ...formData, targetAudience: val })}
                  >
                    <SelectTrigger id="audience" className="bg-slate-800 border-slate-700">
                      <SelectValue placeholder="Select audience" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-800 text-white">
                      <SelectItem value="all">Everyone</SelectItem>
                      <SelectItem value="students">Students</SelectItem>
                      <SelectItem value="teachers">Teachers</SelectItem>
                      <SelectItem value="parents">Parents</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expiresAt" className="text-slate-400 text-[10px] uppercase font-bold">Expiration Synchrony (Optional)</Label>
                  <Input
                    id="expiresAt"
                    type="datetime-local"
                    className="bg-slate-800 border-slate-700 focus:ring-indigo-500 text-white"
                    value={formData.expiresAt}
                    onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 border-t border-slate-800 pt-6">
                <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="text-slate-400 hover:text-white hover:bg-slate-800">
                  Abort
                </Button>
                <Button type="submit" disabled={submitting} className="bg-indigo-600 hover:bg-indigo-700 font-bold px-8">
                  {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Dispatch Broadcast
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        {[
          { label: "Total Active", value: announcements.length, icon: Megaphone, color: "indigo" },
          { label: "High Priority", value: announcements.filter(a => a.priority === "high").length, icon: AlertCircle, color: "rose" },
          { label: "Student Targeted", value: announcements.filter(a => a.target_audience === "students").length, icon: Bell, color: "emerald" },
          { label: "Event Logs", value: announcements.filter(a => a.announcement_type === "event").length, icon: Trophy, color: "blue" }
        ].map((stat, i) => (
          <Card key={i} className="group relative overflow-hidden border-slate-800 bg-slate-900/40 backdrop-blur-md transition-all hover:bg-slate-900/60 border-0 shadow-xl">
            <div className={cn("absolute -right-2 -top-2 h-16 w-16 rounded-full opacity-5 blur-xl transition-opacity group-hover:opacity-20", `bg-${stat.color}-500`)}></div>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">{stat.label}</p>
                  <p className="font-black text-3xl text-white tracking-tighter mt-1">{stat.value}</p>
                </div>
                <div className={cn("p-3 rounded-2xl border bg-slate-950/50",
                  stat.color === "indigo" ? "text-indigo-400 border-indigo-500/20" :
                    stat.color === "rose" ? "text-rose-400 border-rose-500/20" :
                      stat.color === "emerald" ? "text-emerald-400 border-emerald-500/20" :
                        "text-blue-400 border-blue-500/20")}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between bg-slate-950/40 p-4 rounded-2xl border border-slate-800 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <Megaphone className="h-4 w-4 text-indigo-400" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Broadcast Stream</span>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : announcements.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">No announcements found.</p>
        ) : (
          announcements.map((announcement) => (
            <Card key={announcement.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-primary/10 p-2 text-primary">{getTypeIcon(announcement.announcement_type)}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-xl">{announcement.title}</CardTitle>
                        {getTypeBadge(announcement.announcement_type)}
                        {getPriorityBadge(announcement.priority)}
                      </div>
                      <CardDescription className="mt-2 text-sm">
                        Posted by {announcement.posted_by_first_name} {announcement.posted_by_last_name} on {new Date(announcement.posted_at).toLocaleDateString()} • For{" "}
                        {announcement.target_audience}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="icon" variant="destructive" onClick={() => handleDelete(announcement.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{announcement.content}</p>
                {announcement.expires_at && (
                  <p className="mt-4 text-xs text-muted-foreground">
                    Expires: {new Date(announcement.expires_at).toLocaleString()}
                  </p>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
