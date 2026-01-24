"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { apiClient } from "@/lib/api-client"
import { GraduationCap, Sparkles, UserPlus, ShieldCheck, Mail, Lock, User, Phone, ArrowRight, Loader2 } from "lucide-react"

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        firstName: "",
        lastName: "",
        role: "student",
        phone: "",
    })
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value })
    }

    const handleRoleChange = (value: string) => {
        setFormData({ ...formData, role: value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setIsLoading(true)

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match")
            setIsLoading(false)
            return
        }

        try {
            const { confirmPassword, ...registerData } = formData
            const response = await apiClient.register(registerData)

            if (response.error) {
                setError(response.error)
            } else {
                router.push("/login?registered=true")
            }
        } catch (err) {
            setError("Registration failed. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-slate-950 flex items-center justify-center p-4 py-12">
            {/* Background Animations */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-[10%] -right-[10%] h-[40%] w-[40%] rounded-full bg-purple-600/20 blur-[120px] animate-pulse"></div>
                <div className="absolute -bottom-[10%] -left-[10%] h-[40%] w-[40%] rounded-full bg-indigo-600/20 blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            <div className="relative z-10 w-full max-w-[550px]">
                {/* Logo Section */}
                <div className="mb-10 flex flex-col items-center text-center">
                    <Link href="/" className="group flex items-center gap-3 mb-6">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 shadow-xl shadow-purple-500/20 transition-transform group-hover:scale-110">
                            <GraduationCap className="h-7 w-7 text-white" />
                        </div>
                        <span className="text-3xl font-bold tracking-tight text-white">MY <span className="text-purple-400">SCHOOL</span></span>
                    </Link>

                    <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-xs font-semibold text-purple-400 backdrop-blur-md">
                        <UserPlus className="h-3.5 w-3.5" />
                        <span>JOIN OUR ACADEMIC COMMUNITY</span>
                    </div>
                </div>

                <Card className="border-slate-800 bg-slate-900/50 backdrop-blur-2xl shadow-2xl overflow-hidden ring-1 ring-white/10">
                    <div className="absolute top-0 left-0 h-[2px] w-full bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50"></div>

                    <CardHeader className="space-y-1 text-center pb-8 pt-10">
                        <CardTitle className="text-3xl font-bold text-white tracking-tight">Create Account</CardTitle>
                        <CardDescription className="text-slate-400">Join the next generation of learners and educators</CardDescription>
                    </CardHeader>

                    <CardContent className="px-8 pb-10">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName" className="text-slate-200 ml-1">First Name</Label>
                                    <div className="relative group">
                                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-purple-400">
                                            <User className="h-4 w-4" />
                                        </div>
                                        <Input
                                            id="firstName"
                                            placeholder="John"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            className="h-11 border-slate-700 bg-slate-800/50 pl-10 text-white placeholder:text-slate-600 focus:border-purple-500/50 focus:ring-purple-500/20 transition-all rounded-xl"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName" className="text-slate-200 ml-1">Last Name</Label>
                                    <Input
                                        id="lastName"
                                        placeholder="Doe"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        className="h-11 border-slate-700 bg-slate-800/50 text-white placeholder:text-slate-600 focus:border-purple-500/50 focus:ring-purple-500/20 transition-all rounded-xl"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-slate-200 ml-1">Email Address</Label>
                                <div className="relative group">
                                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-purple-400">
                                        <Mail className="h-4 w-4" />
                                    </div>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="john.doe@school.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="h-11 border-slate-700 bg-slate-800/50 pl-10 text-white placeholder:text-slate-600 focus:border-purple-500/50 focus:ring-purple-500/20 transition-all rounded-xl"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="phone" className="text-slate-200 ml-1">Phone (Optional)</Label>
                                    <div className="relative group">
                                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-purple-400">
                                            <Phone className="h-4 w-4" />
                                        </div>
                                        <Input
                                            id="phone"
                                            type="tel"
                                            placeholder="+1234..."
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="h-11 border-slate-700 bg-slate-800/50 pl-10 text-white placeholder:text-slate-600 focus:border-purple-500/50 focus:ring-purple-500/20 transition-all rounded-xl"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="role" className="text-slate-200 ml-1">Register As</Label>
                                    <Select onValueChange={handleRoleChange} defaultValue={formData.role}>
                                        <SelectTrigger className="h-11 border-slate-700 bg-slate-800/50 text-white focus:ring-purple-500/20 rounded-xl">
                                            <SelectValue placeholder="Select a role" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-slate-900 border-slate-800 text-white">
                                            <SelectItem value="student">Student</SelectItem>
                                            <SelectItem value="teacher">Teacher</SelectItem>
                                            <SelectItem value="parent">Parent</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-slate-200 ml-1">Password</Label>
                                    <div className="relative group">
                                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-purple-400">
                                            <Lock className="h-4 w-4" />
                                        </div>
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder="••••••••"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="h-11 border-slate-700 bg-slate-800/50 pl-10 text-white placeholder:text-slate-600 focus:border-purple-500/50 focus:ring-purple-500/20 transition-all rounded-xl"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword" className="text-slate-200 ml-1">Confirm</Label>
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        placeholder="••••••••"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className="h-11 border-slate-700 bg-slate-800/50 text-white placeholder:text-slate-600 focus:border-purple-500/50 focus:ring-purple-500/20 transition-all rounded-xl"
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
                                className="group relative w-full h-12 overflow-hidden rounded-xl bg-purple-600 font-bold text-white transition-all hover:bg-purple-500 active:scale-[0.98]"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    <>
                                        <span className="relative z-10 flex items-center justify-center gap-2">
                                            Create Account
                                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                        </span>
                                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-indigo-500 to-pink-500 opacity-0 transition-opacity group-hover:opacity-100"></div>
                                    </>
                                )}
                            </Button>
                        </form>

                        <div className="mt-8 text-center">
                            <p className="text-sm text-slate-500">
                                Already have an account?{" "}
                                <Link href="/login" className="font-semibold text-purple-400 hover:text-purple-300 transition-colors underline-offset-4 hover:underline">
                                    Sign in instead
                                </Link>
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
