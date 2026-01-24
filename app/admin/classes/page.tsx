"use client"

import { Button } from "@/components/ui/button"
import { ClassesGrid } from "@/components/classes/classes-grid"
import { CreateClassDialog } from "@/components/classes/create-class-dialog"
import { Layers, Download, Plus, LayoutGrid } from "lucide-react"

export default function ClassesPage() {
  return (
    <div className="flex flex-col gap-8 p-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-indigo-400 text-sm font-bold uppercase tracking-widest">
            <Layers className="h-4 w-4" />
            <span>Operational Structure</span>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter">Class Registry</h1>
          <p className="text-slate-400 max-w-md">Orchestrate classroom assignments, academic scheduling, and grade-level distribution.</p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" className="bg-slate-900/50 border-slate-800 text-slate-300 hover:text-white">
            <Download className="mr-2 h-4 w-4" /> Export Report
          </Button>
          <CreateClassDialog />
        </div>
      </div>

      <div className="grid gap-6">
        <div className="flex items-center justify-between bg-slate-950/40 p-4 rounded-2xl border border-slate-800 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="bg-slate-800 text-white hover:bg-slate-700">
              <LayoutGrid className="mr-2 h-4 w-4" /> Grid View
            </Button>
          </div>
          <div className="text-xs text-slate-500 font-bold uppercase tracking-tighter">Showing all active class units</div>
        </div>

        <div className="bg-slate-900/40 rounded-3xl border border-slate-800 p-6 backdrop-blur-xl transition-all">
          <ClassesGrid />
        </div>
      </div>
    </div>
  )
}
