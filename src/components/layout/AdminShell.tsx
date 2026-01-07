"use client";

import Sidebar from "@/components/layout/Sidebar";
import AdminMobileNav from "@/components/layout/AdminMobileNav";

export default function AdminShell({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen bg-bgBody">
            <Sidebar />

            <main className="flex-1 md:ml-[260px] relative pb-40 md:pb-0">
                {children}
            </main>

            <AdminMobileNav />
        </div>
    );
}
