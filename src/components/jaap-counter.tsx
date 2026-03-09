'use client'

import { useState, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { RotateCcw, Plus, Sparkles } from 'lucide-react'
import { toast } from 'sonner'

interface JaapCounterProps {
    mantraId: string
}

export function JaapCounter({ mantraId }: JaapCounterProps) {
    const [count, setCount] = useState(0)
    const [isPulsing, setIsPulsing] = useState(false)

    // Load count from localStorage on mount
    useEffect(() => {
        const savedCount = localStorage.getItem(`jaap-count-${mantraId}`)
        if (savedCount) {
            setCount(parseInt(savedCount, 10))
        }
    }, [mantraId])

    // Save count to localStorage when it changes
    useEffect(() => {
        localStorage.setItem(`jaap-count-${mantraId}`, count.toString())
    }, [count, mantraId])

    const increment = useCallback(() => {
        setCount(prev => prev + 1)
        setIsPulsing(true)

        // Simple haptic feedback simulation
        if (window.navigator.vibrate) {
            window.navigator.vibrate(50)
        }

        setTimeout(() => setIsPulsing(false), 200)

        // Celebrate milestones
        if ((count + 1) === 108) {
            toast.success("108 chants completed! 🙏", {
                description: "You have completed one full mala.",
                duration: 5000,
            })
        }
    }, [count])

    const reset = useCallback(() => {
        if (confirm("Are you sure you want to reset your count?")) {
            setCount(0)
            toast.info("Counter reset.")
        }
    }, [])

    return (
        <div className="flex flex-col items-center gap-8 py-10 px-6 rounded-[3rem] glass relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

            <div className="text-center space-y-2">
                <h3 className="text-sm font-bold uppercase tracking-widest text-primary">Jaap Counter</h3>
                <p className="text-muted-foreground text-xs font-medium">Focus on your breath and tap the center</p>
            </div>

            <div className="relative group">
                {/* Glow Effect */}
                <div className={`absolute inset-0 bg-primary/20 blur-[60px] rounded-full transition-all duration-500 ${isPulsing ? 'scale-110 opacity-100' : 'scale-90 opacity-0 group-hover:opacity-100'}`} />

                <button
                    onClick={increment}
                    className={`relative w-48 h-48 rounded-full flex flex-col items-center justify-center transition-all duration-300 active:scale-95 border-b-4 border-primary shadow-2xl ${isPulsing ? 'bg-primary text-primary-foreground border-transparent scale-105 shadow-primary/40' : 'bg-background glass-dark text-foreground hover:bg-muted'}`}
                >
                    <span className="text-5xl font-black mb-1 tabular-nums">{count}</span>
                    <span className={`text-[0.6rem] font-bold uppercase tracking-tighter ${isPulsing ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                        Chants
                    </span>
                    <Plus className={`absolute top-6 right-6 w-5 h-5 transition-opacity ${isPulsing ? 'opacity-0' : 'opacity-40'}`} />
                </button>
            </div>

            <div className="flex items-center gap-4 w-full">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={reset}
                    className="rounded-2xl hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/20"
                >
                    <RotateCcw className="w-5 h-5" />
                </Button>
                <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden border border-border/50">
                    <div
                        className="h-full bg-primary transition-all duration-500 ease-out"
                        style={{ width: `${(count % 108) / 1.08}%` }}
                    />
                </div>
                <div className="text-[0.6rem] font-bold text-muted-foreground whitespace-nowrap">
                    {count % 108} / 108
                </div>
            </div>

            {count >= 108 && (
                <div className="flex items-center gap-2 text-xs font-bold text-primary animate-bounce">
                    <Sparkles className="w-3 h-3" />
                    <span>Malas completed: {Math.floor(count / 108)}</span>
                </div>
            )}
        </div>
    )
}
