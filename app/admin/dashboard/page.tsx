"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { ClassOverview } from "@/components/dashboard/class-overview"
import { Activity, Users, Clock, ShieldCheck, Sparkles, Zap, Shield, LayoutGrid } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8 p-8 bg-slate-950/50 min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -m-8 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -m-8 h-48 w-48 rounded-full bg-black/20 blur-2xl"></div>

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-white/80 text-sm font-medium">
              <Sparkles className="h-4 w-4" />
              <span>System Operational</span>
            </div>
            <h1 className="text-4xl font-bold text-white tracking-tight">Command Center</h1>
            <p className="text-white/70 max-w-md">
              Welcome back, Administrator. Real-time monitoring and holistic school management at your fingertips.
            </p>
          </div>

          <div className="flex gap-4">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 flex flex-col items-center justify-center min-w-[120px] border border-white/20">
              <div className="text-white/60 text-[10px] uppercase font-bold tracking-widest mb-1">System Health</div>
              <div className="text-2xl font-black text-white">99.9%</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 flex flex-col items-center justify-center min-w-[120px] border border-white/20">
              <div className="text-white/60 text-[10px] uppercase font-bold tracking-widest mb-1">Live Users</div>
              <div className="text-2xl font-black text-white">1.2k</div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <section>
          <div className="flex items-center gap-2 mb-4">
            <LayoutGrid className="h-5 w-5 text-indigo-400" />
            <h2 className="text-lg font-bold text-white/90">Core Statistics</h2>
          </div>
          <DashboardStats />
        </section>

        <div className="grid gap-8 lg:grid-cols-7">
          <Card className="col-span-4 border-slate-800 bg-slate-900/50 backdrop-blur-xl shadow-xl overflow-hidden group border-0">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardHeader className="border-b border-slate-800 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white">Recent Activity</CardTitle>
                  <CardDescription className="text-slate-400">Stream of latest system-wide events</CardDescription>
                </div>
                <div className="p-2 rounded-xl bg-slate-800 text-indigo-400">
                  <Activity className="h-5 w-5" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <RecentActivity />
            </CardContent>
          </Card>

          <Card className="col-span-3 border-slate-800 bg-slate-900/50 backdrop-blur-xl shadow-xl overflow-hidden group border-0">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardHeader className="border-b border-slate-800 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white">Class Distribution</CardTitle>
                  <CardDescription className="text-slate-400">Utilization across grade levels</CardDescription>
                </div>
                <div className="p-2 rounded-xl bg-slate-800 text-pink-400">
                  <Zap className="h-5 w-5" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <ClassOverview />
            </CardContent>
          </Card>
        </div>

        <section className="grid gap-6 md:grid-cols-3">
          <Card className="border-slate-800 bg-slate-900/30 p-6 flex items-center gap-4 hover:transition-colors hover:bg-slate-900/50 group border-0">
            <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-white font-bold">Encrypted Data</h3>
              <p className="text-slate-500 text-sm">All student records are AES-256 secured</p>
            </div>
          </Card>
          <Card className="border-slate-800 bg-slate-900/30 p-6 flex items-center gap-4 hover:transition-colors hover:bg-slate-900/50 group border-0">
            <div className="h-12 w-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-all duration-300">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-white font-bold">Auto-Backups</h3>
              <p className="text-slate-500 text-sm">Synchronized every 6 hours</p>
            </div>
          </Card>
          <Card className="border-slate-800 bg-slate-900/30 p-6 flex items-center gap-4 hover:transition-colors hover:bg-slate-900/50 group border-0">
            <div className="h-12 w-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-white font-bold">Staff Directory</h3>
              <p className="text-slate-500 text-sm">Manage 48 active educators</p>
            </div>
          </Card>
        </section>
      </div>
    </div>
  )
}
