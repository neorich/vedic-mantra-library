'use client'

import { useState } from 'react'
import { createPrompt, updatePrompt } from './actions'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { PromptCard } from '@/components/prompt-card'
import { AlertCircle, Save } from 'lucide-react'

export const nanoBananaCategories = [
    'Portraits',
    'Product Mockup',
    'Editing/Inpainting',
    'Scene Building',
    'Typography in Image',
    'Multi-Subject',
    'Abstract/Artistic',
    'Infographic/Diagram'
]

const STYLES = ['photorealistic', 'cinematic', 'text-rendering', 'character-consistency', 'infographic', '4k', 'macro', 'anime']

export function PromptForm({
    initialData,
    currentUserId
}: {
    initialData?: any,
    currentUserId: string
}) {
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const [title, setTitle] = useState(initialData?.title || '')
    const [promptText, setPromptText] = useState(initialData?.prompt_text || '')
    const [category, setCategory] = useState(initialData?.category || nanoBananaCategories[0])
    const [visibility, setVisibility] = useState(initialData?.visibility || 'public')
    const [styleTags, setStyleTags] = useState<string>(initialData?.style_tags?.join(', ') || '')

    async function handleSubmit(formData: FormData) {
        setIsLoading(true)
        setError(null)

        // Server functions expect FormData
        if (initialData?.id) {
            const result = await updatePrompt(initialData.id, formData)
            if (result?.error) {
                setError(result.error)
                setIsLoading(false)
            }
        } else {
            const result = await createPrompt(formData)
            if (result?.error) {
                setError(result.error)
                setIsLoading(false)
            }
        }
    }

    // Generate a mock prompt object for the preview pane
    const previewPrompt = {
        id: initialData?.id || 'preview',
        title: title || 'Your Prompt Title',
        prompt_text: promptText || 'Your prompt text will appear here...',
        category: category,
        style_tags: styleTags ? styleTags.split(',').map(t => t.trim()).filter(Boolean) : [],
        slug: 'preview',
        votes: initialData?.votes || 0,
        user_id: currentUserId,
        visibility: visibility as 'public' | 'private',
        created_at: initialData?.created_at || new Date().toISOString()
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
                <h2 className="text-xl font-semibold text-zinc-100 mb-6">
                    {initialData ? 'Edit Prompt' : 'Create New Prompt'}
                </h2>
                <form action={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="flex items-center gap-2 p-3 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-md">
                            <AlertCircle className="w-4 h-4" />
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="title" className="text-zinc-300">Title</Label>
                        <Input
                            id="title"
                            name="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Hyper-realistic product mockup with perfect text overlay"
                            required
                            className="bg-zinc-950 border-zinc-800 text-zinc-100 focus-visible:ring-yellow-500/50"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="prompt_text" className="text-zinc-300">Nano Banana 2 Prompt</Label>
                        <Textarea
                            id="prompt_text"
                            name="prompt_text"
                            value={promptText}
                            onChange={(e) => setPromptText(e.target.value)}
                            placeholder="A photorealistic wide shot of a futuristic sports car on a wet neon-lit street..."
                            required
                            className="min-h-[200px] bg-zinc-950 border-zinc-800 text-zinc-100 focus-visible:ring-yellow-500/50 font-mono text-sm"
                        />
                        <p className="text-xs text-zinc-500">The exact text you paste into Nano Banana 2/Gemini</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="category" className="text-zinc-300">Category</Label>
                            <select
                                id="category"
                                name="category"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="flex h-9 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-yellow-500 disabled:cursor-not-allowed disabled:opacity-50 text-zinc-100"
                            >
                                {nanoBananaCategories.map((c) => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="visibility" className="text-zinc-300">Visibility</Label>
                            <select
                                id="visibility"
                                name="visibility"
                                value={visibility}
                                onChange={(e) => setVisibility(e.target.value)}
                                className="flex h-9 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-yellow-500 disabled:cursor-not-allowed disabled:opacity-50 text-zinc-100"
                            >
                                <option value="public">Public - Shared on Explore</option>
                                <option value="private">Private - Only me</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="style_tags" className="text-zinc-300">Style Tags (Comma separated)</Label>
                        <Input
                            id="style_tags"
                            name="style_tags"
                            value={styleTags}
                            onChange={(e) => setStyleTags(e.target.value)}
                            placeholder="e.g. photorealistic, 4k, dark-mode"
                            className="bg-zinc-950 border-zinc-800 text-zinc-100 focus-visible:ring-yellow-500/50"
                        />
                        <div className="flex flex-wrap gap-2 mt-2">
                            {STYLES.map((tag) => (
                                <button
                                    key={tag}
                                    type="button"
                                    onClick={() => {
                                        const current = styleTags.split(',').map(t => t.trim()).filter(Boolean)
                                        if (!current.includes(tag)) {
                                            setStyleTags([...current, tag].join(', '))
                                        }
                                    }}
                                    className="text-xs text-zinc-400 bg-zinc-900 border border-zinc-800 hover:text-yellow-400 hover:border-yellow-500/50 rounded-full px-2 py-1 transition-colors"
                                >
                                    +{tag}
                                </button>
                            ))}
                        </div>
                    </div>

                    <Button
                        className="w-full bg-yellow-500 hover:bg-yellow-600 text-zinc-950 font-bold"
                        type="submit"
                        disabled={isLoading}
                    >
                        <Save className="w-4 h-4 mr-2" />
                        {isLoading ? 'Saving...' : (initialData ? 'Update Prompt' : 'Create Prompt')}
                    </Button>
                </form>
            </div>

            <div className="lg:pl-8 lg:border-l lg:border-zinc-800/50">
                <h2 className="text-xl font-semibold text-zinc-100 mb-6 flex items-center gap-2">
                    Live Preview
                    <span className="text-xs font-normal text-zinc-500 bg-zinc-900 px-2 py-1 rounded-md border border-zinc-800">
                        {visibility.charAt(0).toUpperCase() + visibility.slice(1)}
                    </span>
                </h2>
                <div className="sticky top-20">
                    <PromptCard prompt={previewPrompt} currentUserId={currentUserId} />
                    <div className="mt-8 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-500/90 text-sm">
                        <strong>Tip for Nano Banana 2:</strong> Be extremely descriptive with subjects, lighting, composition, and camera angle. If rendering text, wrap the exact phrase in quotes.
                    </div>
                </div>
            </div>
        </div>
    )
}
