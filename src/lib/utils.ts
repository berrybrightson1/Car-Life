import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import imageCompression from 'browser-image-compression';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export async function compressImage(file: File): Promise<File> {
    const options = {
        maxSizeMB: 0.1,          // Strict 100KB limit
        maxWidthOrHeight: 1920,  // HD 1080p limit
        useWebWorker: true,
        fileType: 'image/webp',  // Force WebP format
        initialQuality: 0.6      // Aggressive compression
    };
    try {
        return await imageCompression(file, options);
    } catch (e) {
        console.error("Compression failed:", e);
        return file;
    }
}

export const CAR_CATEGORIES = [
    "Luxury", "SUV", "Sedan", "Sports", "Truck", "Van", "Electric", "Hybrid", "Vintage"
];
