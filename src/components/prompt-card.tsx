'use client'

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ThumbsUp, ThumbsDown, GitFork, Copy, Edit, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export interface Prompt {
    id: string
    title: string
    prompt_text: string
    category: string | null
    style_tags: string[] | null
    slug: string
    votes: number
    user_id: string
    visibility: 'public' | 'private'
    created_at: string
}

interface PromptCardProps {
    prompt: Prompt
    currentUserId?: string
    isDashboard?: boolean
    onDelete?: (id: string) => void
}

export function PromptCard({ prompt, currentUserId, isDashboard, onDelete }: PromptCardProps) {
    const router = useRouter()
    const supabase = createClient()
    const isOwner = currentUserId === prompt.user_id

    const handleCopy = () => {
        navigator.clipboard.writeText(prompt.prompt_text)
        toast.success('Prompt copied to clipboard!')
    }

    const handleVote = async (value: 1 | -1) => {
        if (!currentUserId) {
            toast.error('You must be logged in to vote')
            return
        }

        try {
            if (value === 1) {
                toast.info('Upvoted!')
            } else {
                toast.info('Downvoted!')
            }

            const { error } = await supabase
                .from('votes')
                .upsert({ prompt_id: prompt.id, user_id: currentUserId, value })

            if (error) throw error
        } catch (err: any) {
            toast.error('Error voting: ' + err.message)
        }
    }

    const handleFork = async () => {
        if (!currentUserId) {
            toast.error('You must be logged in to fork a prompt')
            return
        }

        const { data: newPrompt, error } = await supabase.from('prompts').insert({
            user_id: currentUserId,
            title: `${prompt.title} (Fork)`,
            prompt_text: prompt.prompt_text,
            category: prompt.category,
            style_tags: prompt.style_tags,
            visibility: 'private',
            slug: `${prompt.slug}-fork-${Date.now()}`
        }).select().single()

        if (error) {
            toast.error('Failed to fork prompt: ' + error.message)
        } else {
            toast.success('Prompt forked to your dashboard!')
            router.push(`/prompts/${newPrompt.id}/edit`)
        }
    }

    const handleDelete = async () => {
        if (confirm('Are you sure you want to delete this prompt?')) {
            if (onDelete) {
                onDelete(prompt.id)
            } else {
                const { error } = await supabase.from('prompts').delete().eq('id', prompt.id)
                if (error) {
                    toast.error('Failed to delete prompt')
                } else {
                    toast.success('Prompt deleted')
                    router.refresh()
                }
            }
        }
    }

    return (
        <Card className="flex flex-col border-zinc-800 bg-zinc-900 overflow-hidden hover:border-zinc-700 transition-colors">
            <CardHeader className="pb-3 border-b border-zinc-800/50 bg-zinc-900/50">
                <div className="flex justify-between items-start gap-4">
                    <div>
                        <Link href={`/p/${prompt.slug}`} className="hover:underline hover:text-blue-400">
                            <h3 className="font-semibold text-lg line-clamp-1 text-zinc-100">{prompt.title}</h3>
                        </Link>
                        <div className="flex items-center gap-2 mt-2">
                            {prompt.category && (
                                <Badge variant="secondary" className="bg-zinc-800 text-zinc-300 hover:bg-zinc-700">
                                    {prompt.category}
                                </Badge>
                            )}
                            {prompt.visibility === 'private' && (
                                <Badge variant="outline" className="border-zinc-700 text-zinc-400">Private</Badge>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-1 bg-zinc-800/50 rounded-full px-2 py-1">
                        <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full hover:bg-zinc-700 hover:text-green-400" onClick={() => handleVote(1)}>
                            <ThumbsUp className="h-3 w-3" />
                        </Button>
                        <span className="text-xs font-medium min-w-[2ch] text-center">{prompt.votes}</span>
                        <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full hover:bg-zinc-700 hover:text-red-400" onClick={() => handleVote(-1)}>
                            <ThumbsDown className="h-3 w-3" />
                        </Button>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="pt-4 flex-1">
                <div className="relative group/copy h-full">
                    <p className="text-sm text-zinc-400 line-clamp-4 font-mono leading-relaxed bg-zinc-950 p-3 rounded-md border border-zinc-800/50">
                        {prompt.prompt_text}
                    </p>
                    <Button
                        size="sm"
                        variant="secondary"
                        className="absolute top-2 right-2 opacity-0 group-hover/copy:opacity-100 transition-opacity bg-zinc-800 hover:bg-zinc-700 text-zinc-100 h-7 text-xs"
                        onClick={handleCopy}
                    >
                        <Copy className="h-3 w-3 mr-1" /> Copy
                    </Button>
                </div>

                {prompt.style_tags && prompt.style_tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-4">
                        {prompt.style_tags.map(tag => (
                            <Link key={tag} href={`/explore?q=${encodeURIComponent(tag)}`}>
                                <Badge variant="outline" className="text-[10px] border-zinc-800 text-zinc-500 bg-zinc-950/50 hover:bg-yellow-500/10 hover:text-yellow-500 cursor-pointer transition-colors z-10 relative">
                                    #{tag}
                                </Badge>
                            </Link>
                        ))}
                    </div>
                )}
            </CardContent>

            <CardFooter className="pt-3 pb-3 border-t border-zinc-800/50 bg-zinc-900/30 flex justify-between items-center">
                <div className="text-xs text-zinc-500" suppressHydrationWarning>
                    {new Date(prompt.created_at).toLocaleDateString()}
                </div>

                <div className="flex gap-2">
                    {!isOwner && (
                        <Button variant="ghost" size="sm" className="h-7 text-xs hover:bg-zinc-800 text-zinc-400" onClick={handleFork}>
                            <GitFork className="h-3 w-3 mr-1" /> Fork
                        </Button>
                    )}

                    {isOwner && isDashboard && (
                        <>
                            <Link href={`/prompts/${prompt.id}/edit`}>
                                <Button variant="ghost" size="sm" className="h-7 text-xs hover:bg-blue-900/30 hover:text-blue-400 text-zinc-400">
                                    <Edit className="h-3 w-3 mr-1" /> Edit
                                </Button>
                            </Link>
                            <Button variant="ghost" size="sm" className="h-7 text-xs hover:bg-red-900/30 hover:text-red-400 text-zinc-400" onClick={handleDelete}>
                                <Trash2 className="h-3 w-3 mr-1" /> Delete
                            </Button>
                        </>
                    )}
                </div>
            </CardFooter>
        </Card>
    )
}
