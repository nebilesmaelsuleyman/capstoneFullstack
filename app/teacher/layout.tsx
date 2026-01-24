import { TeacherSidebar } from "@/components/dashboard/teacher-sidebar"
import { TeacherHeader } from "@/components/dashboard/teacher-header"

export default function TeacherLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex h-screen bg-slate-950 overflow-hidden">
            <TeacherSidebar />
            <div className="flex flex-col flex-1 overflow-hidden">
                <TeacherHeader />
                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    )
}
