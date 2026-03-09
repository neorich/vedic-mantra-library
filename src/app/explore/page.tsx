import { createClient } from '@/lib/supabase/server'
import { MantraList } from '@/components/mantra-list'
import { Badge } from '@/components/ui/badge'
import { BookOpen } from 'lucide-react'

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
