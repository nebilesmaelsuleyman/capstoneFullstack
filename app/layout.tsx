import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Toaster } from 'sonner';
import { AuthProvider } from "@/lib/auth-context"
const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "School Management System",
  description: "Comprehensive school management platform for students, teachers, and administrators",

  icons: {

    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`font-sans antialiased`}>
        <AuthProvider>
          <Toaster position="top-right" richColors />
          {children}
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
