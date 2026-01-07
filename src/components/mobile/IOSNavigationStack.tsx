"use client";

import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from "framer-motion";
import React, { ReactNode, useEffect, useState } from "react";

interface IOSNavigationStackProps {
    children: ReactNode;
    detailPage?: ReactNode;
    onBack: () => void;
}

export default function IOSNavigationStack({
    children,
    detailPage,
    onBack,
}: IOSNavigationStackProps) {
    const x = useMotionValue(0);
    const [windowWidth, setWindowWidth] = useState(0);

    useEffect(() => {
        setWindowWidth(window.innerWidth);
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const isDesktop = windowWidth > 768;

    // Mobile Animations
    const transformInput = [0, windowWidth > 0 ? windowWidth : 1];
    // On mobile: Scale down background. On desktop: Keep scale 1.
    const scale = useTransform(x, transformInput, [isDesktop ? 1 : 0.93, 1]);
    const borderRadius = useTransform(x, transformInput, [isDesktop ? 0 : 24, 0]);

    const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        const DRAG_THRESHOLD = windowWidth * (isDesktop ? 0.2 : 0.3);
        const VELOCITY_THRESHOLD = 500;
        const shouldClose = info.offset.x > DRAG_THRESHOLD || info.velocity.x > VELOCITY_THRESHOLD;
        if (shouldClose) {
            onBack();
        }
    };

    return (
        <div className="relative flex-1 w-full h-full overflow-hidden bg-black">
            {/* BACKGROUND LAYER */}
            <motion.div
                className="absolute inset-0 z-0 origin-center overflow-y-auto overflow-x-hidden bg-gray-50"
                initial={false}
                animate={
                    detailPage
                        ? {
                            scale: isDesktop ? 1 : 0.93,
                            filter: isDesktop ? "brightness(1)" : "brightness(0.8)",
                            borderRadius: isDesktop ? "0px" : "24px"
                        }
                        : { scale: 1, filter: "brightness(1)", borderRadius: "0px" }
                }
                style={{ scale, borderRadius }}
                transition={{ type: "spring", stiffness: 400, damping: 40 }}
            >
                {/* Desktop Overlay Backdrop */}
                {detailPage && isDesktop && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-transparent z-10 cursor-pointer transition-all" // Removed visuals
                        onClick={onBack}
                    />
                )}

                {/* Mobile Overlay (transparent blocker) */}
                {detailPage && !isDesktop && (
                    <div className="absolute inset-0 z-10" onClick={onBack} />
                )}
                {children}
            </motion.div>

            {/* FOREGROUND LAYER (Detail Page) */}
            <AnimatePresence>
                {detailPage && (
                    <motion.div
                        className={`absolute z-20 bg-white overflow-hidden shadow-2xl ${isDesktop
                            ? "top-4 right-4 bottom-4 w-[480px] rounded-3xl border border-white/20 ring-1 ring-black/5"
                            : "inset-0"
                            }`}
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{
                            type: "spring",
                            stiffness: isDesktop ? 350 : 400,
                            damping: isDesktop ? 35 : 40
                        }}

                        // Drag Config
                        drag="x"
                        dragConstraints={{ left: 0 }}
                        dragElastic={{ left: 0.05, right: 1 }}
                        onDragEnd={handleDragEnd}
                        style={{ x }}
                    >
                        {detailPage}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
