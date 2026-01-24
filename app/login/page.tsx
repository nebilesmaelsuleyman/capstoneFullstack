"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"
import { GraduationCap, Sparkles, LogIn, ShieldCheck, Mail, Lock, ArrowRight, Loader2 } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const result = await login(email, password)

      if (result.success) {
        const userData = JSON.parse(localStorage.getItem("user_data") || "{}")
        const role = userData.role

        if (role === "admin") {
          router.push("/admin/dashboard")
        } else if (role === "teacher") {
          router.push("/teacher/dashboard")
        } else if (role === "student") {
          router.push("/student/dashboard")
        } else {
          router.push("/dashboard")
        }
      } else {
        setError(result.error || "Invalid email or password")
      }
    } catch (err) {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-slate-950 flex items-center justify-center p-4">
      {/* Background Animations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] h-[40%] w-[40%] rounded-full bg-indigo-600/20 blur-[120px] animate-pulse"></div>
        <div className="absolute -bottom-[10%] -right-[10%] h-[40%] w-[40%] rounded-full bg-purple-600/20 blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10 w-full max-w-[450px]">
        {/* Logo Section */}
        <div className="mb-10 flex flex-col items-center">
          <Link href="/" className="group flex items-center gap-3 mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 shadow-xl shadow-indigo-500/20 transition-transform group-hover:scale-110">
              <GraduationCap className="h-7 w-7 text-white" />
            </div>
            <span className="text-3xl font-bold tracking-tight text-white">MY <span className="text-indigo-400">SCHOOL</span></span>
          </Link>

          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold text-indigo-400 backdrop-blur-md">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>SECURE PORTAL ACCESS</span>
          </div>
        </div>

        <Card className="border-slate-800 bg-slate-900/50 backdrop-blur-2xl shadow-2xl overflow-hidden ring-1 ring-white/10">
          <div className="absolute top-0 left-0 h-[2px] w-full bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50"></div>

          <CardHeader className="space-y-1 text-center pb-8 pt-10">
            <CardTitle className="text-3xl font-bold text-white tracking-tight">Welcome Back</CardTitle>
            <CardDescription className="text-slate-400">Enter your credentials to manage your journey</CardDescription>
          </CardHeader>

          <CardContent className="px-8 pb-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-200 ml-1">Email Address</Label>
                <div className="relative group">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-indigo-400">
                    <Mail className="h-4.5 w-4.5" />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@school.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 border-slate-700 bg-slate-800/50 pl-11 text-white placeholder:text-slate-600 focus:border-indigo-500/50 focus:ring-indigo-500/20 transition-all rounded-xl"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between ml-1">
                  <Label htmlFor="password" className="text-slate-200">Password</Label>
                  <Link href="#" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">Forgot password?</Link>
                </div>
                <div className="relative group">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-indigo-400">
                    <Lock className="h-4.5 w-4.5" />
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 border-slate-700 bg-slate-800/50 pl-11 text-white placeholder:text-slate-600 focus:border-indigo-500/50 focus:ring-indigo-500/20 transition-all rounded-xl"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400 animate-in fade-in zoom-in-95 duration-200">
                  <Sparkles className="h-4 w-4 shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              <Button
                type="submit"
                className="group relative w-full h-12 overflow-hidden rounded-xl bg-indigo-600 font-bold text-white transition-all hover:bg-indigo-500 active:scale-[0.98]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      Sign In
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 transition-opacity group-hover:opacity-100"></div>
                  </>
                )}
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-slate-500">
                Don't have an account?{" "}
                <Link href="/register" className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors underline-offset-4 hover:underline">
                  Create one now
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Demo Badge */}
        <div className="mt-8 text-center animate-in fade-in slide-in-from-bottom-2 duration-1000 delay-500">
          <div className="inline-block rounded-lg border border-slate-800 bg-slate-900/50 px-4 py-3 backdrop-blur-sm text-xs text-slate-500">
            <span className="block mb-1 font-medium text-slate-400">DEMO ACCESS</span>
            <code className="text-indigo-400/80">admin@school.com / 123456789</code>
            <div className="mt-1 opacity-50 text-[10px]">Student/Teacher: 12345678</div>
          </div>
        </div>
      </div>
    </div>
  )
}
