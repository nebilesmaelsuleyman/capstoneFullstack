"use client"

import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, Search } from "lucide-react"
import { Button } from "@/components/ui/button"

export function DashboardHeader() {
  return (
    <header className="flex h-16 items-center justify-between border-border border-b bg-card px-8">
      <div className="flex flex-1 items-center gap-4">
        <div className="relative w-96">
          <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search anything..." className="pl-9" />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="-top-1 -right-1 absolute flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] text-destructive-foreground">
            3
          </span>
        </Button>

        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src="/diverse-avatars.png" />
            <AvatarFallback>AD</AvatarFallback>
          </Avatar>
          <div className="text-sm">
            <p className="font-medium">Admin User</p>
            <p className="text-muted-foreground text-xs">Administrator</p>
          </div>
        </div>
      </div>
    </header>
  )
}
