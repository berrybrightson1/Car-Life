export default function ShippingCountries() {
    return (
        <div className="inline-flex items-center gap-3 bg-[#0f172a] text-white pl-1.5 pr-4 py-1.5 rounded-full shadow-lg border border-white/10 animate-fade-in-up">
            <div className="flex -space-x-2">
                <div className="w-7 h-7 rounded-full bg-white border-2 border-[#0f172a] overflow-hidden shadow-sm z-30" title="Ghana">
                    <img src="https://flagcdn.com/w40/gh.png" alt="Ghana" className="w-full h-full object-cover" />
                </div>
                <div className="w-7 h-7 rounded-full bg-white border-2 border-[#0f172a] overflow-hidden shadow-sm z-20" title="USA">
                    <img src="https://flagcdn.com/w40/us.png" alt="USA" className="w-full h-full object-cover" />
                </div>
                <div className="w-7 h-7 rounded-full bg-white border-2 border-[#0f172a] overflow-hidden shadow-sm z-10" title="China">
                    <img src="https://flagcdn.com/w40/cn.png" alt="China" className="w-full h-full object-cover" />
                </div>
                <div className="w-7 h-7 rounded-full bg-gray-700 border-2 border-[#0f172a] flex items-center justify-center text-[10px] font-bold shadow-sm z-0">
                    <span className="ml-0.5">+</span>
                </div>
            </div>
            <span className="text-sm font-bold tracking-wide">10+ Countries Operations</span>
        </div>
    );
}
