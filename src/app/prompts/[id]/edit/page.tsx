import { createClient } from '@/lib/supabase/server'
import { PromptForm } from '../../prompt-form'
import { redirect, notFound } from 'next/navigation'

export const metadata = {
    title: 'Edit Prompt | Nano Banana 2',
}

export default async function EditPromptPage({
    params
}: {
    params: { id: string }
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Handle params according to Next.js 15
    const resolvedParams = await params

    const { data: prompt, error } = await supabase
        .from('prompts')
        .select('*')
        .eq('id', resolvedParams.id)
        .single()

    if (error || !prompt) {
        notFound()
    }

    if (prompt.user_id !== user.id) {
        redirect('/dashboard')
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <div className="mb-8 border-b border-zinc-800/50 pb-4">
                <h1 className="text-3xl font-bold tracking-tight text-zinc-100">Edit Prompt</h1>
                <p className="text-zinc-400 mt-1">Refining: {prompt.title}</p>
            </div>

            <PromptForm initialData={prompt} currentUserId={user.id} />
        </div>
    )
}
