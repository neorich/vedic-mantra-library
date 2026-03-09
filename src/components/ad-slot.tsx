'use client'

import { useEffect, useState } from 'react'

interface AdSlotProps {
    className?: string;
    width?: number | string;
    height?: number | string;
    format?: 'auto' | 'fluid' | 'rectangle';
}

export function AdSlot({ className = '', width = '100%', height = 90, format = 'auto' }: AdSlotProps) {
    const [isMounted, setIsMounted] = useState(false)

    // In production, you would check an environment variable like process.env.NEXT_PUBLIC_ADSENSE_CLIENT
    // to decide whether to render the actual ad tag or a placeholder.
    const showPlaceholder = process.env.NODE_ENV !== 'production' || !process.env.NEXT_PUBLIC_ADSENSE_CLIENT

    useEffect(() => {
        setIsMounted(true)
        if (!showPlaceholder) {
            try {
                // @ts-ignore
                ; (window.adsbygoogle = window.adsbygoogle || []).push({})
            } catch (err) {
                console.error('AdSense error:', err)
            }
        }
    }, [showPlaceholder])

    if (!isMounted) return null

    if (showPlaceholder) {
        return (
            <div
                className={`glass flex flex-col items-center justify-center text-center overflow-hidden border-dashed border-2 border-primary/20 bg-primary/5 rounded-2xl ${className}`}
                style={{ width, height, minHeight: height }}
            >
                <div className="text-[0.6rem] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-1">Advertisement</div>
                <div className="text-sm font-medium text-primary/60">Ad Space Available</div>
            </div>
        )
    }

    return (
        <div className={`overflow-hidden text-center flex justify-center w-full ${className}`}>
            <ins
                className="adsbygoogle"
                style={{ display: 'block', width, height }}
                data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT}
                data-ad-slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT || "auto"} // Fallback or pass as prop
                data-ad-format={format}
                data-full-width-responsive="true"
            />
        </div>
    )
}
