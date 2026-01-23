"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { GraduationCap, BookOpen, Users, Trophy, Shield, Rocket, ArrowRight, CheckCircle2, Star, Sparkles, LayoutDashboard } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

export default function LandingPage() {
  const { user } = useAuth()

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-200 selection:bg-indigo-500/30">
      {/* Dynamic Background */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-slate-950" />
      <div className="fixed inset-0 -z-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150" />

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 shadow-lg shadow-indigo-500/20">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">MY SCHOOL</span>
          </div>

          <nav className="hidden items-center gap-8 md:flex">
            {["Features", "Services", "About", "Pricing"].map((item) => (
              <Link key={item} href={`#${item.toLowerCase()}`} className="text-sm font-medium text-slate-400 transition-colors hover:text-white">
                {item}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            {user ? (
              <Link href={user.role === 'admin' ? '/admin/dashboard' : user.role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard'}>
                <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg hover:shadow-indigo-500/25 transition-all">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login" className="hidden text-sm font-medium text-slate-400 transition-colors hover:text-white sm:block">
                  Login
                </Link>
                <Link href="/login">
                  <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg hover:shadow-indigo-500/25 transition-all">
                    Start Learning
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-24 sm:py-32">
          <div className="container relative mx-auto px-4 sm:px-6">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="mb-8 flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-sm font-medium text-indigo-400 backdrop-blur-md animate-in fade-in slide-in-from-bottom-3 duration-1000">

                <span>Modern School Management </span>
              </div>

              <h1 className="max-w-4xl text-5xl font-extrabold tracking-tight text-white sm:text-7xl lg:leading-[1.1] animate-in fade-in slide-in-from-bottom-5 duration-1000 delay-150">
                Unlocking the Future of <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Digital Education</span>
              </h1>

              <p className="mt-8 max-w-2xl text-lg text-slate-400 animate-in fade-in slide-in-from-bottom-5 duration-1000 delay-300">
                Empower your institution with a complete, integrated platform for students, teachers, and administrators. Seamlessly manage attendance, grades, announcements, and more.
              </p>

              <div className="mt-12 flex flex-wrap items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-5 duration-1000 delay-500">
                <Link href="/login">
                  <Button size="lg" className="h-12 px-8 bg-white text-slate-950 hover:bg-slate-200 transition-all font-semibold rounded-full group">
                    Get Started Free
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link href="#features">
                  <Button variant="outline" size="lg" className="h-12 px-8 border-slate-700 bg-slate-900/50 text-white hover:bg-slate-800 transition-all font-medium rounded-full">
                    View Features
                  </Button>
                </Link>
              </div>

              {/* Stats/Social Proof */}
              <div className="mt-16 grid grid-cols-2 gap-8 md:grid-cols-4 animate-in fade-in delay-700">
                <div className="flex flex-col items-center">
                  <span className="text-3xl font-bold text-white">50k+</span>
                  <span className="text-xs uppercase tracking-widest text-slate-500 font-semibold mt-1">Students</span>
                </div>
                <div className="flex flex-col items-center border-l border-slate-800 pl-8">
                  <span className="text-3xl font-bold text-white">2k+</span>
                  <span className="text-xs uppercase tracking-widest text-slate-500 font-semibold mt-1">Schools</span>
                </div>
                <div className="flex flex-col items-center border-l border-slate-800 pl-8">
                  <span className="text-3xl font-bold text-white">99.9%</span>
                  <span className="text-xs uppercase tracking-widest text-slate-500 font-semibold mt-1">Uptime</span>
                </div>
                <div className="flex flex-col items-center border-l border-slate-800 pl-8">
                  <span className="text-3xl font-bold text-white">24/7</span>
                  <span className="text-xs uppercase tracking-widest text-slate-500 font-semibold mt-1">Support</span>
                </div>
              </div>
            </div>
          </div>

          {/* Background Blobs */}
          <div className="absolute top-1/2 left-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-600/20 blur-[120px]" />
          <div className="absolute top-[20%] right-[10%] -z-10 h-[300px] w-[300px] rounded-full bg-purple-600/10 blur-[100px]" />
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-slate-900/40 backdrop-blur-sm border-y border-slate-800">
          <div className="container mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-base font-semibold text-indigo-400 uppercase tracking-widest">Everything You Need</h2>
            <p className="mt-4 text-3xl font-bold text-white sm:text-5xl">All-in-one Education Management</p>

            <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { title: "Real-time Attendance", desc: "Track student presence effortlessly across different sessions and subjects.", icon: CheckCircle2, color: "from-blue-500 to-cyan-500" },
                { title: "Academic Tracking", desc: "Manage grades, assignments, and exams with comprehensive analytics for progress.", icon: Trophy, color: "from-yellow-500 to-amber-500" },
                { title: "Dynamic Announcements", desc: "Broadcast important school updates instantly to specific groups or everyone.", icon: Bell, color: "from-purple-500 to-pink-500" },
                { title: "Smart Timetables", desc: "Automated schedule management that prevents conflicts and keeps everyone organized.", icon: Calendar, color: "from-green-500 to-emerald-500" },
                { title: "Secure Data", desc: "Enterprise-grade security with role-based access control protecting all user privacy.", icon: Shield, color: "from-red-500 to-rose-500" },
                { title: "Collaboration", desc: "Seamless communication tools for teachers, parents, and students to stay connected.", icon: Users, color: "from-indigo-500 to-violet-500" },
              ].map((f, i) => (
                <div key={i} className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 p-8 text-left transition-all hover:-translate-y-1 hover:border-slate-700 hover:shadow-2xl">
                  <div className={`mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${f.color} shadow-lg shadow-indigo-500/10`}>
                    <f.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{f.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Access Role Section */}
        <section className="py-24 container mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12 rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 to-black p-8 lg:p-16 relative overflow-hidden">
            <div className="flex-1 space-y-6 relative z-10">
              <h2 className="text-4xl font-bold text-white lg:text-5xl tracking-tight">Tailored Experience for <span className="text-indigo-400 text-glow-indigo">Every User</span></h2>
              <p className="text-lg text-slate-400 leading-relaxed">Whether you're an administrator overseeing operations, a teacher shaping minds, or a student reaching for your potential — EduPulse provides exactly what you need.</p>
              <div className="grid gap-4 pt-4 sm:grid-cols-3">
                <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 transition-colors hover:bg-slate-800/80">
                  <span className="font-bold text-white block mb-1">Administrators</span>
                  <span className="text-sm text-slate-500">Total Control</span>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 transition-colors hover:bg-slate-800/80">
                  <span className="font-bold text-white block mb-1">Teachers</span>
                  <span className="text-sm text-slate-500">Teaching Efficiency</span>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 transition-colors hover:bg-slate-800/80">
                  <span className="font-bold text-white block mb-1">Students</span>
                  <span className="text-sm text-slate-500">Learning Records</span>
                </div>
              </div>
            </div>
            <div className="flex-1 relative z-10">
              <div className="relative mx-auto max-w-[400px]">
                <div className="aspect-square rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 opacity-20 blur-3xl absolute inset-0 -z-10" />
                <div className="rounded-2xl border border-slate-700 bg-slate-900 p-2 shadow-2xl skew-y-3 -rotate-2 hover:rotate-0 hover:skew-y-0 transition-all duration-500">
                  <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800" alt="Students learning" className="rounded-xl grayscale hover:grayscale-0 transition-all duration-700" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 text-center">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="rounded-3xl bg-indigo-600 p-12 lg:p-24 relative overflow-hidden shadow-2xl shadow-indigo-500/20">
              <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
              <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
              <div className="relative z-10">
                <h2 className="text-4xl font-bold text-white sm:text-6xl mb-6">Ready to Transform Your School?</h2>
                <p className="mx-auto max-w-2xl text-lg text-indigo-100 mb-10">Join thousands of leading educational institutions that trust EduPulse for their digital management.</p>
                <Link href="/login">
                  <Button size="lg" className="h-14 px-12 bg-white text-indigo-600 hover:bg-slate-100 text-lg font-bold rounded-full transition-all">
                    Create Your Account Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-12">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">EduPulse</span>
            </div>
            <p className="text-sm text-slate-500">© 2024 EduPulse Platform Labs. All rights reserved.</p>
            <div className="flex gap-6 text-sm text-slate-500">
              <Link href="#" className="hover:text-white transition-colors text-[11px] uppercase tracking-tighter">Privacy Policy</Link>
              <Link href="#" className="hover:text-white transition-colors text-[11px] uppercase tracking-tighter">Terms of Service</Link>
              <Link href="#" className="hover:text-white transition-colors text-[11px] uppercase tracking-tighter">Contact Support</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

function Bell(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  )
}

function Calendar(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  )
}
