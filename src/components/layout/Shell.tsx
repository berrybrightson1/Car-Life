import Sidebar from "./Sidebar";
import MobileNav from "./MobileNav";

export default function Shell({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen bg-bgBody">
            <Sidebar />

            {/* Main Content Area */}
            <main className="flex-1 md:ml-[260px] pb-32 md:pb-0 relative">
                {children}
            </main>

            <MobileNav />
        </div>
    );
}
