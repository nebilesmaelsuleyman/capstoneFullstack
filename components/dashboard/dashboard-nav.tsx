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
  ShieldCheck,
  Command
} from "lucide-react"
import { logout } from "@/lib/auth-utils"

const navigation = [
  { name: "Terminal", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Students", href: "/admin/students", icon: Users },
  { name: "Teachers", href: "/admin/teachers", icon: GraduationCap },
  { name: "Class Units", href: "/admin/classes", icon: BookOpen },
  { name: "Attendance", href: "/admin/attendance", icon: ClipboardCheck },
  { name: "Exams", href: "/admin/exams", icon: ClipboardList },
  { name: "Schedule", href: "/admin/timetable", icon: Calendar },
  { name: "Broadcasts", href: "/admin/announcements", icon: Megaphone },
  { name: "Financials", href: "/admin/fees", icon: DollarSign },
  { name: "Academy Hub", href: "/admin/library", icon: BookMarked },
  { name: "System Control", href: "/admin/settings", icon: Settings },
]

export function DashboardNav() {
  const pathname = usePathname()

  return (
    <aside className="flex w-64 flex-col border-r border-slate-900 bg-slate-950/50 backdrop-blur-xl">
      <div className="flex h-24 items-center px-8">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-[0_0_15px_rgba(79,70,229,0.4)] group-hover:scale-110 transition-transform">
            <Command className="h-6 w-6 text-white" />
          </div>
          <div className="flex flex-col">
            <h2 className="font-black text-lg tracking-tighter text-white leading-none">EDU OS</h2>
            <span className="text-[10px] text-indigo-400 font-bold tracking-widest uppercase mt-1">Command Center</span>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1.5 px-4 py-6 overflow-y-auto custom-scrollbar">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all duration-300",
                isActive
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                  : "text-slate-500 hover:bg-slate-900 hover:text-white"
              )}
            >
              <Icon className={cn("h-5 w-5 transition-transform group-hover:scale-110", isActive ? "text-white" : "text-slate-500 group-hover:text-indigo-400")} />
              {item.name}
              {isActive && (
                <div className="ml-auto h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
              )}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-slate-900 bg-slate-950/80">
        <button
          onClick={() => logout()}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-slate-500 transition-all hover:bg-rose-500/10 hover:text-rose-500 group"
        >
          <LogOut className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
          Sign Out Authority
        </button>
      </div>
    </aside>
  )
}
