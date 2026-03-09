'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Quote, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

const inspirations = [
    {
        text: "The soul is neither born, nor does it ever die; nor having once existed, does it ever cease to be.",
        source: "Bhagavad Gita"
    },
    {
        text: "When meditation is mastered, the mind is unwavering like the flame of a candle in a windless place.",
        source: "Bhagavad Gita"
    },
    {
        text: "You are what your deep, driving desire is. As your desire is, so is your will. As your will is, so is your deed.",
        source: "Upanishads"
    },
    {
        text: "Truth can be stated in a thousand different ways, yet each one can be true.",
        source: "Swami Vivekananda"
    },
    {
        text: "Peace comes from within. Do not seek it without.",
        source: "Buddha"
    }
]

export function DailyInspiration() {
    const [index, setIndex] = useState(0)

    useEffect(() => {
        // Pick based on date
        const day = new Date().getDate()
        setIndex(day % inspirations.length)
    }, [])

    const next = () => {
        setIndex((prev) => (prev + 1) % inspirations.length)
    }

    const current = inspirations[index]

    return (
        <section className="py-20 relative overflow-hidden">
            <div className="absolute inset-0 bg-primary/[0.02] -z-10" />
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="glass p-12 md:p-20 rounded-[4rem] text-center relative"
                >
                    <div className="bg-primary/10 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-10 ring-1 ring-primary/20">
                        <Quote className="h-8 w-8 text-primary" />
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.5 }}
                            className="space-y-8"
                        >
                            <h2 className="text-3xl md:text-5xl font-serif italic leading-tight text-foreground/90 max-w-4xl mx-auto">
                                "{current.text}"
                            </h2>
                            <div className="flex items-center justify-center gap-4">
                                <div className="h-px w-8 bg-primary/30" />
                                <span className="text-primary font-black uppercase tracking-[0.3em] text-xs">
                                    {current.source}
                                </span>
                                <div className="h-px w-8 bg-primary/30" />
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={next}
                        className="mt-12 rounded-full hover:bg-primary/10 group transition-all duration-500"
                    >
                        <RefreshCw className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:rotate-180 transition-all duration-700" />
                    </Button>

                    {/* Decorative elements */}
                    <Sparkles className="absolute top-10 left-10 w-8 h-8 text-primary/10" />
                    <Sparkles className="absolute bottom-10 right-10 w-8 h-8 text-primary/10" />
                </motion.div>
            </div>
        </section>
    )
}
