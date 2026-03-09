import { createClient } from '@/lib/supabase/server'
import { PromptCard, Prompt } from '@/components/prompt-card'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { PlusCircle, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { redirect } from 'next/navigation'

export const metadata = {
    title: 'Dashboard | Nano Banana 2',
}

export default async function DashboardPage({
    searchParams,
}: {
    searchParams?: { [key: string]: string | string[] | undefined }
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Parse search params correctly using Promise resolution if it's considered asynchronous in some contexts,
    // but in Next.js 15 page props searchParams is a Promise. We need to await it.
    const resolvedSearchParams = await searchParams
    const query = resolvedSearchParams?.q as string || ''

    // Fetch user's prompts
    let dbQuery = supabase
        .from('prompts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    if (query) {
        dbQuery = dbQuery.ilike('title', `%${query}%`)
    }

    const { data: prompts, error } = await dbQuery

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-100">My Library</h1>
                    <p className="text-zinc-400 mt-1">Manage your collection of sacred mantras.</p>
                </div>
                <Link href="/prompts/new">
                    <Button className="bg-yellow-500 hover:bg-yellow-600 text-zinc-950 font-semibold shadow-lg shadow-yellow-500/20">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        New Prompt
                    </Button>
                </Link>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-8 items-center bg-zinc-900/50 p-4 rounded-lg border border-zinc-800">
                <div className="relative w-full sm:max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                    <form method="GET">
                        <Input
                            name="q"
                            defaultValue={query}
                            placeholder="Search your library..."
                            className="pl-9 bg-zinc-950 border-zinc-800 focus-visible:ring-yellow-500/50"
                        />
                    </form>
                </div>
                <div className="text-sm text-zinc-500 w-full sm:w-auto text-center sm:text-left">
                    {prompts?.length || 0} prompt(s) found
                </div>
            </div>

            {!prompts || prompts.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 text-center bg-zinc-900/20 rounded-xl border border-zinc-800 border-dashed">
                    <div className="bg-zinc-900 p-4 rounded-full mb-4">
                        <PlusCircle className="h-8 w-8 text-zinc-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-zinc-300 mb-2">No prompts found</h3>
                    <p className="text-zinc-500 max-w-sm mb-6">
                        {query
                            ? `No prompts matching "${query}". Try a different search.`
                            : "You haven't saved any mantras yet. Create your first one to get started!"}
                    </p>
                    {!query && (
                        <Link href="/prompts/new">
                            <Button variant="outline" className="border-zinc-700 hover:bg-zinc-800">Create Prompt</Button>
                        </Link>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {prompts.map((prompt: Prompt) => (
                        <PromptCard
                            key={prompt.id}
                            prompt={prompt}
                            currentUserId={user.id}
                            isDashboard={true}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
