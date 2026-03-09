'use client'

import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Heart, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

interface MantraCardProps {
    mantra: {
        id: string
        slug: string
        title: string
        sanskrit_text: string
        translation: string
        deity?: string
        categories?: { name: string }
    }
}

export function MantraCard({ mantra }: MantraCardProps) {
    return (
        <motion.div
            whileHover={{ y: -8 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="h-full"
        >
            <Link href={`/mantra/${mantra.slug}`} className="group block h-full">
                <div className="glass h-full p-8 rounded-[2.5rem] flex flex-col transition-all duration-500 group-hover:border-primary/40 group-hover:bg-primary/5 relative overflow-hidden ring-1 ring-white/20 shadow-2xl">
                    {/* Decorative background element with subtle pulse */}
                    <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
                        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -top-12 -right-12 w-48 h-48 bg-primary/20 blur-[60px] rounded-full"
                    />

                    <div className="flex items-start justify-between gap-4 mb-8 relative z-10">
                        <div className="space-y-2">
                            {mantra.categories && (
                                <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary/70 pointer-events-none mb-2 px-3 py-0.5 rounded-full text-[0.65rem] uppercase tracking-wider font-bold">
                                    {mantra.categories.name}
                                </Badge>
                            )}
                            <h3 className="text-2xl font-black text-foreground group-hover:text-primary transition-colors leading-[1.1] font-serif italic">
                                {mantra.title}
                            </h3>
                        </div>
                        <div className="bg-primary/5 p-3 rounded-2xl group-hover:bg-primary/10 transition-colors shrink-0 ring-1 ring-primary/10">
                            <Sparkles className="w-6 h-6 text-primary/40 group-hover:text-primary transition-colors" />
                        </div>
                    </div>

                    <div className="flex-1 space-y-6 relative z-10">
                        <div className="p-6 bg-primary/[0.03] rounded-3xl border border-primary/10 group-hover:border-primary/20 transition-all duration-500 shadow-inner group-hover:bg-white/50 dark:group-hover:bg-black/20">
                            <p className="font-display text-4xl text-center leading-[1.4] text-foreground/90 group-hover:text-foreground transition-all duration-500 overflow-hidden text-ellipsis whitespace-nowrap px-2">
                                {mantra.sanskrit_text}
                            </p>
                        </div>
                        <p className="text-muted-foreground line-clamp-2 text-base italic leading-relaxed px-2 font-serif">
                            "{mantra.translation}"
                        </p>
                    </div>

                    <div className="mt-10 pt-6 border-t border-primary/10 flex items-center justify-between relative z-10">
                        {mantra.deity && (
                            <div className="flex items-center gap-2.5 text-xs font-bold text-muted-foreground/80">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                                <span className="uppercase tracking-widest">{mantra.deity}</span>
                            </div>
                        )}
                        <span className="text-[0.7rem] font-black text-primary flex items-center gap-1.5 opacity-0 group-hover:opacity-100 -translate-x-3 group-hover:translate-x-0 transition-all duration-500 uppercase tracking-widest">
                            Practice Now <ArrowRight className="w-4 h-4" />
                        </span>
                    </div>
                </div>
            </Link>
        </motion.div>
    )
}
