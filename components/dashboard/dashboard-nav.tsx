"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
  Settings,
  LogOut,
  ClipboardCheck,
  ClipboardList,
  Megaphone,
  DollarSign,
  BookMarked,
} from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Students", href: "/admin/students", icon: Users },
  { name: "Teachers", href: "/admin/teachers", icon: GraduationCap },
  { name: "Classes", href: "/admin/classes", icon: BookOpen },
  { name: "Attendance", href: "/attendance", icon: ClipboardCheck },
  { name: "Exams", href: "/admin/exams", icon: ClipboardList },
  { name: "Timetable", href: "/admin/timetable", icon: Calendar },
  { name: "Announcements", href: "/admin/announcements", icon: Megaphone },
  { name: "Fees", href: "/admin/fees", icon: DollarSign },
  { name: "Library", href: "/admin/library", icon: BookMarked },
  { name: "Settings", href: "/admin/settings", icon: Settings },
]

export function DashboardNav() {
  const pathname = usePathname()

  return (
    <aside className="flex w-60 flex-col border-border border-r bg-background">
      <div className="flex h-14 items-center px-6">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded bg-foreground" />
          <h2 className="font-semibold text-sm tracking-tight">University OS</h2>
        </div>
      </div>

      <nav className="flex-1 space-y-0.5 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                isActive
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="px-3 py-4">
        <button className="flex w-full items-center gap-2.5 rounded-md px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary/50 hover:text-foreground">
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
