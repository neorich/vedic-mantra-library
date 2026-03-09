import { createClient } from '@/lib/supabase/server'
import { MantraList } from '@/components/mantra-list'
import { BookOpen, Sparkles, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Metadata } from 'next'
import { AdSlot } from '@/components/ad-slot'

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ category?: string }> }): Promise<Metadata> {
    const supabase = await createClient()
    const resolvedParams = await searchParams
    const categoryId = resolvedParams.category

    if (categoryId) {
        const { data: cat } = await supabase.from('categories').select('name').eq('id', categoryId).single()
        if (cat) {
            return {
                title: `${cat.name} Mantras | Vedic Library`,
                description: `Explore powerful Vedic chants for ${cat.name.toLowerCase()}.`,
                openGraph: {
                    title: `${cat.name} Mantras | Vedic Library`,
                    description: `Explore powerful Vedic chants for ${cat.name.toLowerCase()}.`,
                }
            }
        }
    }

    return {
        title: "Explore Mantras | Vedic Library",
        description: "Browse our expansive collection of sacred Sanskrit mantras.",
    }
}

export default async function ExplorePage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
    const supabase = await createClient()
    const resolvedParams = await searchParams
    const categoryId = resolvedParams.category

    let query = supabase
        .from('mantras')
        .select('*, categories(name)')
        .order('created_at', { ascending: false })

    if (categoryId) {
        query = query.eq('category_id', categoryId)
    }

    const { data: mantras, error } = await query

    let categoryName = null
    if (categoryId) {
        const { data: cat } = await supabase.from('categories').select('name').eq('id', categoryId).single()
        if (cat) categoryName = cat.name
    }

    if (error) {
        console.error('Error fetching mantras:', error)
    }

    let mantraOfTheDay = null
    if (!categoryId && mantras && mantras.length > 0) {
        const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
        const index = dayOfYear % mantras.length
        mantraOfTheDay = mantras[index]
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div className="space-y-4">
                    <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary">
                        <BookOpen className="w-3 h-3 mr-2" />
                        Sacred Library
                    </Badge>
                    <h1 className="text-4xl md:text-5xl font-serif font-black tracking-tight">
                        {categoryName ? (
                            <>{categoryName} <span className="text-gradient">Mantras</span></>
                        ) : (
                            <>Explore <span className="text-gradient">Mantras</span></>
                        )}
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-2xl">
                        Discover powerful ancient chants for peace, health, success, and spiritual growth.
                    </p>
                </div>
            </div>

            {mantraOfTheDay && (
                <div className="mb-16">
                    <div className="flex items-center gap-2 mb-6 px-2">
                        <Sparkles className="w-5 h-5 text-primary" />
                        <h2 className="text-2xl font-serif font-bold text-foreground">Mantra of the Day</h2>
                    </div>
                    <Link href={`/mantra/${mantraOfTheDay.slug}`} className="block group">
                        <div className="glass p-8 md:p-12 rounded-[3rem] relative overflow-hidden ring-1 ring-white/10 hover:ring-primary/30 transition-all duration-500 hover:bg-primary/5">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] rounded-full group-hover:bg-primary/10 transition-colors" />

                            <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
                                <div className="space-y-4 max-w-2xl">
                                    <h3 className="text-3xl md:text-5xl font-display font-medium text-foreground tracking-tight">
                                        {mantraOfTheDay.sanskrit_text}
                                    </h3>
                                    <div>
                                        <p className="font-serif text-xl md:text-2xl font-bold text-primary mb-2">
                                            {mantraOfTheDay.title}
                                        </p>
                                        <p className="text-muted-foreground leading-relaxed line-clamp-2">
                                            {mantraOfTheDay.translation}
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-primary/10 p-4 rounded-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 md:ml-auto shrink-0 text-primary">
                                    <ArrowRight className="w-6 h-6" />
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>
            )}

            <AdSlot className="mb-16 rounded-[2rem] overflow-hidden" height={120} />

            {mantras && mantras.length > 0 ? (
                <MantraList mantras={mantras} />
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center glass rounded-3xl">
                    <div className="bg-muted p-4 rounded-full mb-4">
                        <BookOpen className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">No mantras found</h3>
                    <p className="text-muted-foreground">Our library is currently being updated. Please check back soon.</p>
                </div>
            )}
        </div>
    )
}
