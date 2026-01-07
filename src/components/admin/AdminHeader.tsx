
import { LucideIcon, Plus } from "lucide-react"
import Link from "next/link"

interface AdminHeaderProps {
    title: string
    description?: string
    action?: {
        label: string
        href: string
        icon?: LucideIcon
    }
}

export default function AdminHeader({ title, description, action }: AdminHeaderProps) {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{title}</h1>
                {description && <p className="text-gray-500 mt-1">{description}</p>}
            </div>

            {action && (
                <Link
                    href={action.href}
                    className="bg-primary hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-200 transition-all active:scale-95"
                >
                    {action.icon && <action.icon size={18} strokeWidth={2.5} />}
                    {action.label}
                </Link>
            )}
        </div>
    )
}
