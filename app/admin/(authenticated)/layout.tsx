import { AdminHeader } from '@/components/admin/admin-header'

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Top Navigation Bar with Context Switcher */}
            <AdminHeader />

            {/* Main Content Area */}
            <div className="flex-1 w-full">
                {children}
            </div>
        </div>
    )
}
