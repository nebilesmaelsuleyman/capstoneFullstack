"use client"

import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, Search, Settings, ShieldCheck, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function DashboardHeader() {
  return (
    <header className="flex h-20 items-center justify-between border-b border-slate-900 bg-slate-950/50 backdrop-blur-xl px-10 relative z-40">
      <div className="flex flex-1 items-center gap-6">
        <div className="relative w-full max-w-lg group">
          <Search className="-translate-y-1/2 absolute top-1/2 left-4 h-4 w-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
          <Input
            placeholder="Search system registry, students, or staff..."
            className="pl-12 bg-slate-900/50 border-slate-800 focus:border-indigo-500 focus:ring-indigo-500/20 h-11 rounded-xl transition-all w-full"
          />
        </div>
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
          <Zap className="h-3.5 w-3.5 text-emerald-500 animate-pulse" />
          <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">System Online</span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative h-10 w-10 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all">
            <Bell className="h-5 w-5" />
            <span className="top-2 right-2 absolute flex h-2 w-2 items-center justify-center rounded-full bg-rose-500 animate-ping"></span>
            <span className="top-2 right-2 absolute flex h-2 w-2 items-center justify-center rounded-full bg-rose-500"></span>
          </Button>
          <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all">
            <Settings className="h-5 w-5" />
          </Button>
        </div>

        <div className="h-8 w-[1px] bg-slate-800 ml-2 mr-2 hidden sm:block"></div>

        <div className="flex items-center gap-4 pl-2 group cursor-pointer">
          <div className="flex flex-col items-end hidden sm:flex">
            <p className="font-bold text-sm text-white group-hover:text-indigo-400 transition-colors">Admin Core</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <ShieldCheck className="h-3 w-3 text-indigo-400" />
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none">Root Auth</span>
            </div>
          </div>
          <div className="relative">
            <Avatar className="h-11 w-11 rounded-xl border-2 border-slate-800 group-hover:border-indigo-500 transition-all duration-300 shadow-xl overflow-hidden ring-offset-2 ring-offset-slate-950 ring-2 ring-transparent group-hover:ring-indigo-500/50">
              <AvatarImage src="/diverse-avatars.png" className="object-cover" />
              <AvatarFallback className="bg-gradient-to-br from-slate-800 to-slate-950 text-indigo-400 text-xs font-black">AD</AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 border-2 border-slate-950 shadow-[0_0_5px_rgba(16,185,129,0.5)]"></div>
          </div>
        </div>
      </div>
    </header>
  )
}
