'use client'

import Link from 'next/link'
import { Sun, Search, BookOpen } from 'lucide-react'

export function Navbar() {
    return (
        <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <div className="flex items-center gap-6">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="bg-primary/10 p-2 rounded-xl group-hover:bg-primary/20 transition-colors">
                            <Sun className="h-6 w-6 text-primary" />
                        </div>
                        <span className="font-bold text-lg hidden sm:inline-block">Vedic Mantras</span>
                    </Link>
                    <div className="hidden md:flex gap-6 text-sm font-medium items-center">
                        <Link href="/explore" className="text-muted-foreground hover:text-primary transition-colors">Explore</Link>
                        <Link href="/categories" className="text-muted-foreground hover:text-primary transition-colors">Categories</Link>
                        <Link href="/faq" className="text-muted-foreground hover:text-primary transition-colors">FAQ</Link>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <form action="/explore" className="relative hidden sm:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                            name="q"
                            type="search"
                            placeholder="Search mantras..."
                            className="h-9 w-48 lg:w-64 rounded-full border border-border bg-muted/50 pl-9 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all font-serif"
                        />
                    </form>
                    <Link href="/explore" className="sm:hidden text-muted-foreground hover:text-primary transition-colors">
                        <Search className="h-5 w-5" />
                    </Link>
                </div>
            </div>
        </nav>
    )
}
