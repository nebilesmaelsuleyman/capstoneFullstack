"use client"

import { Star, User } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useEffect, useState } from "react"
import { getCurrentUser } from "@/lib/auth-utils"

export function StudentHeader() {
    const [user, setUser] = useState<any>(null)

    useEffect(() => {
        setUser(getCurrentUser())
    }, [])

    const handleProfileClick = () => {
        const event = new CustomEvent("student-dashboard-nav", { detail: "profile" })
        window.dispatchEvent(event)
    }

    return (
        <header className="h-20 bg-slate-950/50 backdrop-blur-xl border-b border-slate-800 px-8 flex items-center justify-between sticky top-0 z-50">
            <div className="flex items-center gap-3 text-white">
                <Star className="h-6 w-6 text-yellow-400 animate-pulse" />
                <h1 className="text-2xl font-bold tracking-tight">Student Dashboard</h1>
            </div>

            <div className="flex items-center gap-4">
                <div className="text-right hidden md:block">
                    <p className="text-sm font-semibold text-white">
                        {user ? `${user.firstName || user.first_name} ${user.lastName || user.last_name}` : "Loading..."}
                    </p>
                    <p className="text-xs text-slate-400 capitalize">{user?.role || "Student"}</p>
                </div>
                <Avatar
                    className="h-10 w-10 border-2 border-indigo-500/30 cursor-pointer hover:scale-105 transition-transform"
                    onClick={handleProfileClick}
                >
                    <AvatarImage src="/placeholder-avatar.jpg" />
                    <AvatarFallback className="bg-indigo-600 text-white font-bold">
                        {user ? `${(user.firstName || user.first_name)?.[0]}${(user.lastName || user.last_name)?.[0]}` : "S"}
                    </AvatarFallback>
                </Avatar>
            </div>
        </header>
    )
}
