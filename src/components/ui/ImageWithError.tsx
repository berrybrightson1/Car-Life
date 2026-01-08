"use client";

import { useState, useEffect } from "react";
import CarPlaceholder from "@/components/ui/CarPlaceholder";
import { Listing } from "@/lib/mock-db";

export default function ImageWithError({ car, className = "w-full h-full object-cover" }: { car: Listing, className?: string }) {
    const [error, setError] = useState(false);
    const [loaded, setLoaded] = useState(false);

    // Reset error state if car image changes (e.g. recycling cells)
    useEffect(() => {
        setError(false);
        setLoaded(false);
    }, [car.image, car.images]);

    const imageSrc = car.images?.[0] || car.image;

    if (!imageSrc || error) {
        return <CarPlaceholder className="w-full h-full" />;
    }

    return (
        <>
            <img
                src={imageSrc}
                alt={car.name}
                className={`${className} ${loaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
                onLoad={() => setLoaded(true)}
                onError={() => setError(true)}
            />
            {!loaded && <div className="absolute inset-0 bg-gray-100 animate-pulse" />}
        </>
    );
}
