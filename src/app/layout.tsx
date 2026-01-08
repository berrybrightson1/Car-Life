import type { Metadata } from "next";
import { Sora } from "next/font/google";
import Shell from "@/components/layout/Shell";
import { CurrencyProvider } from "@/context/CurrencyContext";
import { Toaster } from "sonner";
import "./globals.css";

const sora = Sora({
    subsets: ["latin"],
    variable: '--font-sora',
    weight: ['300', '400', '600', '700', '800'],
});

export const metadata: Metadata = {
    title: "Car Life - Logistics & Retail System",
    description: "Advanced automotive logistics and retail platform.",
};

import { ThemeProvider } from "@/components/providers/ThemeProvider";

// ...

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${sora.variable} font-sans`} suppressHydrationWarning>
                <ThemeProvider>
                    <CurrencyProvider>
                        {children}
                        <Toaster position="top-center" richColors />
                    </CurrencyProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
