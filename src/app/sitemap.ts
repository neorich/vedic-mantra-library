import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const supabase = await createClient()
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://vedic-mantra-library-neorich.netlify.app'

    // Static routes
    const routes = [
        '',
        '/explore',
        '/categories',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1 : 0.8,
    }))

    // Dynamic mantra routes
    const { data: mantras } = await supabase
        .from('mantras')
        .select('slug, updated_at')

    const mantraRoutes = (mantras || []).map((mantra) => ({
        url: `${baseUrl}/mantra/${mantra.slug}`,
        lastModified: new Date(mantra.updated_at).toISOString(),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
    }))

    return [...routes, ...mantraRoutes]
}
