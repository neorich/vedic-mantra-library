import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PromptInteractions } from './prompt-interactions'
import { PromptCard, Prompt } from '@/components/prompt-card'
import Link from 'next/link'
import { ChevronLeft, User, Calendar } from 'lucide-react'

// Metadata generation for SEO/Sharing
export async function generateMetadata({ params }: { params: { slug: string } }) {
    const supabase = await createClient()
    const resolvedParams = await params

    const { data: prompt } = await supabase
        .from('prompts')
        .select('title, category')
        .eq('slug', resolvedParams.slug)
        .single()

    if (!prompt) return { title: 'Not Found | Nano Banana 2' }

    return {
        title: `${prompt.title} | Nano Banana 2 Prompts`,
        description: `A battle-tested ${prompt.category || ''} prompt for Nano Banana 2 image generation.`,
    }
}

export default async function SinglePromptPage({
    params
}: {
    params: { slug: string }
}) {
    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.getSession()

    const resolvedParams = await params

    // Fetch prompt independently
    const { data: prompt, error } = await supabase
        .from('prompts')
        .select('*')
        .eq('slug', resolvedParams.slug)
        .single()

    if (error || !prompt) {
        notFound()
    }

    // Attempt to fetch profile info
    const { data: profile } = await supabase
        .from('profiles')
        .select('username, avatar_url')
        .eq('id', prompt.user_id)
        .single()

    // Stitch it for the template
    const fullPrompt = {
        ...prompt,
        profiles: profile
    }

    // Determine if viewer is owner
    const isOwner = session?.user?.id === fullPrompt.user_id

    // Enforce RLS visually (though DB does it too)
    if (fullPrompt.visibility === 'private' && !isOwner) {
        notFound()
    }

    // Fetch related prompts
    const { data: relatedPrompts } = await supabase
        .from('prompts')
        .select('*')
        .eq('category', fullPrompt.category)
        .neq('id', fullPrompt.id)
        .eq('visibility', 'public')
        .order('votes', { ascending: false })
        .limit(3)

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl pt-12">
            <Link href="/explore">
                <Button variant="ghost" size="sm" className="mb-6 -ml-2 text-zinc-400 hover:text-zinc-100">
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Back to Explore
                </Button>
            </Link>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl mb-12">
                {/* Header Section */}
                <div className="p-6 md:p-10 border-b border-zinc-800/50 bg-zinc-900/50">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                        <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-3 mb-4">
                                {fullPrompt.category && (
                                    <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 px-3 py-1">
                                        {fullPrompt.category}
                                    </Badge>
                                )}
                                <div className="flex items-center text-sm text-zinc-500 space-x-4">
                                    <span className="flex items-center">
                                        <User className="h-3.5 w-3.5 mr-1" />
                                        {fullPrompt.profiles?.username || 'Anonymous'}
                                    </span>
                                    <span className="flex items-center" suppressHydrationWarning>
                                        <Calendar className="h-3.5 w-3.5 mr-1" />
                                        {new Date(fullPrompt.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>

                            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-100 leading-tight">
                                {fullPrompt.title}
                            </h1>
                        </div>

                        {/* Voting and Interaction client component */}
                        <PromptInteractions
                            promptId={fullPrompt.id}
                            initialVotes={fullPrompt.votes}
                            currentUserId={session?.user?.id}
                            promptText={fullPrompt.prompt_text}
                            isOwner={isOwner}
                        />
                    </div>
                </div>

                {/* Prompt Content Section */}
                <div className="p-6 md:p-10">
                    <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-4">The Prompt</h3>
                    <div className="relative group">
                        <div className="bg-zinc-950 p-6 rounded-xl border border-zinc-800/80 shadow-inner">
                            <p className="text-lg md:text-xl font-mono text-zinc-200 leading-relaxed whitespace-pre-wrap selection:bg-yellow-500/30">
                                {fullPrompt.prompt_text}
                            </p>
                        </div>
                    </div>

                    {fullPrompt.style_tags && fullPrompt.style_tags.length > 0 && (
                        <div className="mt-10">
                            <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-4">Tags</h3>
                            <div className="flex flex-wrap gap-2">
                                {fullPrompt.style_tags.map((tag: string) => (
                                    <Link key={tag} href={`/explore?q=${encodeURIComponent(tag)}`}>
                                        <Badge variant="outline" className="border-zinc-800 text-zinc-400 text-sm px-3 py-1 bg-zinc-900/50 hover:bg-yellow-500/10 hover:text-yellow-500 hover:border-yellow-500/50 cursor-pointer transition-colors">
                                            #{tag}
                                        </Badge>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Related Prompts Section */}
            {relatedPrompts && relatedPrompts.length > 0 && (
                <div className="mt-16 border-t border-zinc-800/50 pt-12">
                    <h2 className="text-2xl font-bold text-zinc-100 mb-8">Related Prompts</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {relatedPrompts.map((relatedPrompt: Prompt) => (
                            <PromptCard
                                key={relatedPrompt.id}
                                prompt={relatedPrompt}
                                currentUserId={session?.user?.id}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
