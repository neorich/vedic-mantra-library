import { createClient } from '@/lib/supabase/server'
import { PromptCard, Prompt } from '@/components/prompt-card'
import { Input } from '@/components/ui/input'
import { Search, Flame } from 'lucide-react'

export const metadata = {
    title: 'Explore Prompts | Nano Banana 2',
}

export default async function ExplorePage({
    searchParams,
}: {
    searchParams?: { [key: string]: string | string[] | undefined }
}) {
    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.getSession()

    const resolvedSearchParams = await searchParams
    const query = resolvedSearchParams?.q as string || ''

    let dbQuery = supabase
        .from('prompts')
        .select('*')
        .eq('visibility', 'public')

    if (query) {
        // Utilize the full-text search index 'fts'
        const searchQuery = query.trim().split(' ').map(term => `${term}:*`).join(' & ')
        dbQuery = dbQuery.textSearch('fts', searchQuery)
    }

    // Order by votes DESC for ranking "best" prompts
    dbQuery = dbQuery.order('votes', { ascending: false }).order('created_at', { ascending: false })

    const { data: prompts, error } = await dbQuery

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="text-center mb-12 max-w-2xl mx-auto mt-8">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 mb-4">
                    Discover Nano Banana 2 Prompts
                </h1>
                <p className="text-zinc-400 text-lg">
                    Explore the highest-quality, battle-tested prompts designed specifically for Nano Banana 2 image generation.
                </p>
            </div>

            <div className="max-w-2xl mx-auto mb-12">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
                    <form method="GET">
                        <Input
                            name="q"
                            defaultValue={query}
                            placeholder="Search by keyword, style, or subject..."
                            className="pl-12 h-14 rounded-full bg-zinc-900/80 border-zinc-800 text-lg placeholder:text-zinc-500 focus-visible:ring-yellow-500/50 shadow-xl"
                        />
                    </form>
                </div>
            </div>

            <div className="flex items-center gap-2 mb-6 border-b border-zinc-800 pb-2">
                <Flame className="text-orange-500 w-5 h-5" />
                <h2 className="text-xl font-semibold text-zinc-200">
                    {query ? `Search Results for "${query}"` : 'Top Rated Prompts'}
                </h2>
            </div>

            {!prompts || prompts.length === 0 ? (
                <div className="text-center py-20 bg-zinc-900/30 rounded-xl border border-zinc-800/50">
                    <p className="text-zinc-500 text-lg">No public prompts match your criteria.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {prompts.map((prompt: Prompt) => (
                        <PromptCard
                            key={prompt.id}
                            prompt={prompt}
                            currentUserId={session?.user?.id}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
