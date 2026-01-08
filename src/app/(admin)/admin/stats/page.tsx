export default function StatsPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
            <h1 className="text-2xl font-bold mb-4">Statistics Dashboard</h1>
            <div className="bg-yellow-50 text-yellow-800 px-6 py-4 rounded-xl border border-yellow-200 shadow-sm max-w-md">
                <p className="font-semibold">Under Migration</p>
                <p className="text-sm mt-1">This module is currently being migrated to the new production database.</p>
            </div>
        </div>
    );
}
