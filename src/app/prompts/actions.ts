'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

function createSlug(title: string) {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') + '-' + Date.now().toString(36)
}

export async function createPrompt(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Unauthorized' }
    }

    const title = formData.get('title') as string
    const prompt_text = formData.get('prompt_text') as string
    const category = formData.get('category') as string
    const visibility = formData.get('visibility') as 'public' | 'private'

    // Parse style tags string (comma separated) into array
    const styleTagsRaw = formData.get('style_tags') as string
    const style_tags = styleTagsRaw
        ? styleTagsRaw.split(',').map(t => t.trim().toLowerCase()).filter(t => t.length > 0)
        : []

    if (!title || !prompt_text) {
        return { error: 'Title and prompt text are required' }
    }

    const slug = createSlug(title)

    const { data, error } = await supabase
        .from('prompts')
        .insert({
            user_id: user.id,
            title,
            prompt_text,
            category,
            style_tags,
            visibility,
            slug
        })
        .select()
        .single()

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/dashboard')
    revalidatePath('/explore')
    redirect(`/p/${data.slug}`)
}

export async function updatePrompt(id: string, formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Unauthorized' }
    }

    const title = formData.get('title') as string
    const prompt_text = formData.get('prompt_text') as string
    const category = formData.get('category') as string
    const visibility = formData.get('visibility') as 'public' | 'private'

    const styleTagsRaw = formData.get('style_tags') as string
    const style_tags = styleTagsRaw
        ? styleTagsRaw.split(',').map(t => t.trim().toLowerCase()).filter(t => t.length > 0)
        : []

    if (!title || !prompt_text) {
        return { error: 'Title and prompt text are required' }
    }

    const { data, error } = await supabase
        .from('prompts')
        .update({
            title,
            prompt_text,
            category,
            style_tags,
            visibility,
            updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('user_id', user.id) // Ensure ownership
        .select()
        .single()

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/dashboard')
    revalidatePath(`/p/${data.slug}`)
    revalidatePath('/explore')
    redirect(`/p/${data.slug}`)
}
