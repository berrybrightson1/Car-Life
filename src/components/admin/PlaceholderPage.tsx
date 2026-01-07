export default function PlaceholderPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">🚧</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Coming Soon</h1>
            <p className="text-gray-500 max-w-md">This feature is currently under development. Check back later!</p>
        </div>
    );
}
