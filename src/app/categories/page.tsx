'use client'

import { Badge } from '@/components/ui/badge'
import { BookOpen, Heart, Sparkles, Sun, Moon, Zap } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { useState, useEffect } from 'react'
import { AdSlot } from '@/components/ad-slot'

const iconMap: Record<string, any> = {
    'Peace & Shanti': Moon,
    'Health & Healing': Heart,
    'Success & Prosperity': Sun,
    'Devotional': Sparkles,
    'Knowledge & Wisdom': Zap
}

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
}

const item: any = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
}

export default function CategoriesPage() {
    const [categories, setCategories] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchCategories() {
            const supabase = createClient()
            const { data, error } = await supabase
                .from('categories')
                .select('*')
                .order('name')

            if (data) setCategories(data)
            setLoading(false)
        }
        fetchCategories()
    }, [])

    return (
        <div className="container mx-auto px-4 py-12">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-4 mb-12"
            >
                <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary">
                    <BookOpen className="w-3 h-3 mr-2" />
                    Spiritual Focus
                </Badge>
                <h1 className="text-4xl md:text-6xl font-serif font-black tracking-tight">
                    Mantra <span className="text-gradient">Categories</span>
                </h1>
                <p className="text-muted-foreground text-lg max-w-2xl font-serif italic">
                    Follow the path that resonates with your soul's current vibration.
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
            >
                <AdSlot className="mb-12 rounded-[2rem]" height={120} />
            </motion.div>

            {!loading && categories.length > 0 ? (
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {categories.map((category) => {
                        const Icon = iconMap[category.name] || BookOpen
                        return (
                            <motion.div key={category.id} variants={item}>
                                <Link href={`/explore?category=${category.id}`} className="group">
                                    <div className="glass p-10 rounded-[3rem] h-full flex flex-col items-center text-center transition-all duration-500 group-hover:border-primary/50 group-hover:bg-primary/5 ring-1 ring-white/10 shadow-2xl">
                                        <div className="bg-primary/5 p-5 rounded-3xl mb-8 group-hover:bg-primary/10 transition-colors ring-1 ring-primary/10">
                                            <Icon className="h-10 w-10 text-primary/60 group-hover:text-primary transition-colors" />
                                        </div>
                                        <h3 className="text-2xl font-black mb-4 font-serif italic">{category.name}</h3>
                                        <p className="text-muted-foreground text-base leading-relaxed font-serif">
                                            {category.description}
                                        </p>
                                    </div>
                                </Link>
                            </motion.div>
                        )
                    })}
                </motion.div>
            ) : loading ? (
                <div className="flex flex-col items-center justify-center py-40">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        className="p-4"
                    >
                        <Sparkles className="h-12 w-12 text-primary opacity-20" />
                    </motion.div>
                    <p className="text-muted-foreground font-serif italic mt-4">Tuning the cosmic layers...</p>
                </div>
            ) : (
                <div className="text-center py-20 glass rounded-[3rem]">
                    <p className="text-muted-foreground font-serif italic">Initializing sacred paths...</p>
                </div>
            )}
        </div>
    )
}
