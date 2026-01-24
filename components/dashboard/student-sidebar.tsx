"use client"

import { cn } from "@/lib/utils"
import {
    LayoutDashboard,
    Bell,
    Calendar,
    Award,
    BookOpen,
    ClipboardCheck,
    BookMarked,
    User,
    LogOut
} from "lucide-react"
import { logout } from "@/lib/auth-utils"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

const navigation = [
    { name: "Announcements", id: "announcements", icon: Bell },
    { name: "Timetable", id: "timetable", icon: Calendar },
    { name: "Grades", id: "grades", icon: Award },
    { name: "Classes", id: "classes", icon: BookOpen },
    { name: "Attendance", id: "attendance", icon: ClipboardCheck },
    { name: "Library", id: "library", icon: BookMarked },
    { name: "Profile", id: "profile", icon: User },
]

export function StudentSidebar() {
    // We'll use a custom event or a store to communicate with the page
    const [activeTab, setActiveTab] = useState("announcements")

    const handleNavClick = (id: string) => {
        setActiveTab(id)
        // Dispatch a custom event that the dashboard page can listen to
        const event = new CustomEvent("student-dashboard-nav", { detail: id })
        window.dispatchEvent(event)
    }

    return (
        <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-full">
            <div className="p-6">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                        <BookOpen className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-xl font-bold text-white tracking-tight">EduOS</span>
                </div>
            </div>

            <nav className="flex-1 px-4 space-y-2 py-4">
                {navigation.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => handleNavClick(item.id)}
                        className={cn(
                            "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                            activeTab === item.id
                                ? "bg-indigo-600/10 text-indigo-400 border border-indigo-600/20"
                                : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                        )}
                    >
                        <item.icon className={cn("h-5 w-5", activeTab === item.id ? "text-indigo-400" : "text-slate-500")} />
                        {item.name}
                    </button>
                ))}
            </nav>

            <div className="p-4 mt-auto border-t border-slate-800">
                <button
                    onClick={() => logout()}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all duration-200"
                >
                    <LogOut className="h-5 w-5" />
                    Sign Out
                </button>
            </div>
        </aside>
    )
}
