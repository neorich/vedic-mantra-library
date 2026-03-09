import { createClient } from '@/lib/supabase/server'
import { PromptForm } from '../prompt-form'
import { redirect } from 'next/navigation'

export const metadata = {
    title: 'Create Prompt | Nano Banana 2',
}

export default async function NewPromptPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <div className="mb-8 border-b border-zinc-800/50 pb-4">
                <h1 className="text-3xl font-bold tracking-tight text-zinc-100">Create New Prompt</h1>
                <p className="text-zinc-400 mt-1">Share your best Nano Banana 2 configurations with the community or build your private library.</p>
            </div>

            <PromptForm currentUserId={user.id} />
        </div>
    )
}
