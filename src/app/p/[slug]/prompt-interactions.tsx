'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { ThumbsUp, ThumbsDown, Copy, GitFork, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface PromptInteractionsProps {
    promptId: string
    initialVotes: number
    currentUserId?: string
    promptText: string
    isOwner: boolean
}

export function PromptInteractions({
    promptId,
    initialVotes,
    currentUserId,
    promptText,
    isOwner
}: PromptInteractionsProps) {
    const [votes, setVotes] = useState(initialVotes)
    const [userVote, setUserVote] = useState<1 | -1 | 0>(0)
    const supabase = createClient()
    const router = useRouter()

    useEffect(() => {
        // Fetch initial user vote
        if (currentUserId) {
            supabase
                .from('votes')
                .select('value')
                .eq('prompt_id', promptId)
                .eq('user_id', currentUserId)
                .single()
                .then(({ data }) => {
                    if (data) setUserVote(data.value as 1 | -1)
                })
        }

        // Set up Realtime Subscription for votes
        const channel = supabase.channel(`prompt_votes_${promptId}`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'prompts',
                    filter: `id=eq.${promptId}`
                },
                (payload: any) => {
                    // Triggered by the DB trigger that updates prompt.votes atomically
                    if (payload.new && payload.new.votes !== undefined) {
                        setVotes(payload.new.votes)
                    }
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [promptId, currentUserId, supabase])

    const handleVote = async (value: 1 | -1) => {
        if (!currentUserId) {
            toast.error('You must be logged in to vote')
            return
        }

        const isRemovingVote = userVote === value
        const newValue = isRemovingVote ? 0 : value

        // Optimistically update UI local state for immediate feedback
        // DB Trigger handles the actual `prompts.votes` field update via Realtime
        setUserVote(newValue as 1 | -1 | 0)

        try {
            if (isRemovingVote) {
                toast.success(`Removed vote`)
                const { error } = await supabase
                    .from('votes')
                    .delete()
                    .eq('prompt_id', promptId)
                    .eq('user_id', currentUserId)
                if (error) throw error
            } else {
                toast.success(value === 1 ? 'Upvoted!' : 'Downvoted!')
                const { error } = await supabase
                    .from('votes')
                    .upsert({ prompt_id: promptId, user_id: currentUserId, value })
                if (error) throw error
            }
        } catch (err: any) {
            toast.error('Error voting: ' + err.message)
            setUserVote(userVote) // Revert optimistic update
        }
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(promptText)
        toast.success('Prompt copied to clipboard!')
    }

    const handleFork = async () => {
        if (!currentUserId) {
            toast.error('You must be logged in to fork this prompt')
            return
        }

        try {
            const { data: originalPrompt } = await supabase
                .from('prompts')
                .select('title, category, style_tags, slug')
                .eq('id', promptId)
                .single()

            if (!originalPrompt) throw new Error('Original prompt not found')

            const { data: newPrompt, error } = await supabase.from('prompts').insert({
                user_id: currentUserId,
                title: `${originalPrompt.title} (Fork)`,
                prompt_text: promptText,
                category: originalPrompt.category,
                style_tags: originalPrompt.style_tags,
                visibility: 'private',
                slug: `${originalPrompt.slug}-fork-${Date.now()}` // Basic logic to avoid slug collisions over short intervals
            }).select().single()

            if (error) throw error

            toast.success('Prompt forked to your library!')
            router.push(`/prompts/${newPrompt.id}/edit`)
        } catch (error: any) {
            toast.error(`Fork failed: ${error.message}`)
        }
    }

    return (
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-6 md:mt-0">
            <div className="flex items-center bg-zinc-950 rounded-full p-1 border border-zinc-800 shadow-inner">
                <Button
                    variant="ghost"
                    size="icon"
                    className={`rounded-full h-10 w-10 ${userVote === 1 ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' : 'text-zinc-400 hover:text-green-400 hover:bg-zinc-900'}`}
                    onClick={() => handleVote(1)}
                >
                    <ThumbsUp className={`h-5 w-5 ${userVote === 1 ? 'fill-current' : ''}`} />
                </Button>
                <span className="font-bold text-lg min-w-[3ch] text-center text-zinc-200">
                    {votes}
                </span>
                <Button
                    variant="ghost"
                    size="icon"
                    className={`rounded-full h-10 w-10 ${userVote === -1 ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' : 'text-zinc-400 hover:text-red-400 hover:bg-zinc-900'}`}
                    onClick={() => handleVote(-1)}
                >
                    <ThumbsDown className={`h-5 w-5 ${userVote === -1 ? 'fill-current' : ''}`} />
                </Button>
            </div>

            <div className="flex gap-2">
                {!isOwner && (
                    <Button
                        variant="outline"
                        className="border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-300"
                        onClick={handleFork}
                    >
                        <GitFork className="h-4 w-4 mr-2" />
                        Fork
                    </Button>
                )}
                <Button
                    className="bg-yellow-500 hover:bg-yellow-600 text-zinc-950 font-bold shadow-lg shadow-yellow-500/20"
                    onClick={handleCopy}
                >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Prompt
                </Button>
            </div>
        </div>
    )
}
