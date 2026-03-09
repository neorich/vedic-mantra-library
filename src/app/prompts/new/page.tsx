import { createClient } from '@/lib/supabase/server'
import { PromptForm } from '../prompt-form'
import { redirect } from 'next/navigation'

export const metadata = {
    title: 'Create Mantra | Vedic Mantra Library',
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
                <h1 className="text-3xl font-bold tracking-tight text-zinc-100">Create New Mantra</h1>
                <p className="text-zinc-400 mt-1">Add a new sacred mantra to your private library or share it with the community.</p>
            </div>

            <PromptForm currentUserId={user.id} />
        </div>
    )
}
