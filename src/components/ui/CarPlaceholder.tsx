import { Car } from 'lucide-react';

export default function CarPlaceholder({ className }: { className?: string }) {
    return (
        <div className={`flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 text-gray-400 ${className}`}>
            <Car size="40%" strokeWidth={1.5} />
        </div>
    );
}
