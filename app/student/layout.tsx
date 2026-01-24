import { StudentSidebar } from "@/components/dashboard/student-sidebar"
import { StudentHeader } from "@/components/dashboard/student-header"

export default function StudentLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex h-screen bg-slate-950 overflow-hidden">
            <StudentSidebar />
            <div className="flex flex-col flex-1 overflow-hidden">
                <StudentHeader />
                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    )
}
