'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Sparkles, Search, BookOpen, Music, Heart, Sun, ArrowRight } from 'lucide-react'
import { DailyInspiration } from '@/components/daily-inspiration'
import { motion } from 'framer-motion'

export default function Home() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-3.5rem)]">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-500/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-yellow-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto space-y-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="bg-orange-50 border-orange-100 text-orange-600 dark:bg-orange-950/20 dark:border-orange-900 dark:text-orange-400 px-4 py-1.5 rounded-full text-sm mx-auto inline-flex items-center mb-6 shadow-sm">
              <Sparkles className="w-4 h-4 mr-2" />
              Discover Ancient Wisdom
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-6xl md:text-8xl font-serif font-black tracking-tighter text-foreground leading-[0.9]"
          >
            Sacred <span className="text-primary italic">Mantras</span> <br className="hidden md:block" />
            <span className="text-gradient">for Modern Soul</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-serif italic"
          >
            Experience the divine resonance of Sanskrit. The largest curated library of ancient chants with profound wisdom and interactive practice.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8"
          >
            <Link href="/explore">
              <Button size="lg" className="w-full sm:w-auto font-black h-14 px-10 shadow-2xl shadow-primary/40 text-xl rounded-full group">
                Explore Library <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/categories">
              <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-10 text-xl glass rounded-full ring-1 ring-white/20">
                Browse Categories
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Daily Inspiration Section */}
      <DailyInspiration />

      {/* Feature Grid */}
      <section className="border-t border-border/50 bg-muted/30 py-20 px-4 relative z-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass p-8 rounded-3xl flex flex-col items-center text-center hover:scale-[1.02] transition-transform">
            <div className="bg-orange-100 dark:bg-orange-900/30 p-4 rounded-2xl mb-6">
              <BookOpen className="h-8 w-8 text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="text-xl font-bold mb-3">Vast Library</h3>
            <p className="text-muted-foreground">Access hundreds of authentic mantras from the Vedas and Upanishads, all in one place.</p>
          </div>
          <div className="glass p-8 rounded-3xl flex flex-col items-center text-center hover:scale-[1.02] transition-transform">
            <div className="bg-yellow-100 dark:bg-yellow-900/30 p-4 rounded-2xl mb-6">
              <Music className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
            </div>
            <h3 className="text-xl font-bold mb-3">Daily Jaap</h3>
            <p className="text-muted-foreground">Interactive jaap counter to track your spiritual practice and maintain daily consistency.</p>
          </div>
          <div className="glass p-8 rounded-3xl flex flex-col items-center text-center hover:scale-[1.02] transition-transform">
            <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-2xl mb-6">
              <Heart className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-bold mb-3">Holistic Benefits</h3>
            <p className="text-muted-foreground">Understand the mental, physical, and spiritual benefits of every chant you perform.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4 text-center text-muted-foreground text-sm">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Sun className="h-4 w-4 text-primary" />
          <span className="font-semibold text-foreground">Vedic Mantra Library</span>
        </div>
        <p>© 2026 Dedicated to Universal Peace and Wisdom.</p>
      </footer>
    </div>
  )
}
