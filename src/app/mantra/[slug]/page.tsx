import { createClient } from '@/lib/supabase/server'
import * as motion from 'framer-motion/client'
import { notFound } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { JaapCounter } from '@/components/jaap-counter'
import { ArrowLeft, Heart, Sparkles, BookOpen, Volume2 } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Metadata } from 'next'
import { AdSlot } from '@/components/ad-slot'
import { RichTextRenderer } from '@/components/rich-text-renderer'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const supabase = await createClient()
    const resolvedParams = await params

    const { data: mantra } = await supabase
        .from('mantras')
        .select('title, translation, benefits')
        .eq('slug', resolvedParams.slug)
        .single()

    if (!mantra) return {}

    return {
        title: `${mantra.title} | Vedic Mantras`,
        description: mantra.translation?.substring(0, 160) || mantra.benefits?.substring(0, 160),
        openGraph: {
            title: `${mantra.title} | Vedic Mantras`,
            description: mantra.translation?.substring(0, 160) || mantra.benefits?.substring(0, 160),
        }
    }
}

export default async function MantraDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const supabase = await createClient()
    const resolvedParams = await params

    const { data: mantra, error } = await supabase
        .from('mantras')
        .select('*, categories(name)')
        .eq('slug', resolvedParams.slug)
        .single()

    if (error || !mantra) {
        notFound()
    }

    const structuredData = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Article",
                "headline": `${mantra.title} - Meaning and Benefits`,
                "description": mantra.translation || mantra.benefits,
                "articleSection": mantra.categories?.name,
                "text": mantra.sanskrit_text
            },
            {
                "@type": "FAQPage",
                "mainEntity": [
                    {
                        "@type": "Question",
                        "name": `What is the meaning of ${mantra.title}?`,
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": mantra.translation
                        }
                    },
                    {
                        "@type": "Question",
                        "name": `What are the benefits of chanting ${mantra.title}?`,
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": mantra.benefits
                        }
                    },
                    ...(mantra.pronunciation ? [{
                        "@type": "Question",
                        "name": `How to pronounce ${mantra.title}?`,
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": `The phonetic pronunciation is: ${mantra.pronunciation}. Listen and repeat slowly.`
                        }
                    }] : [])
                ]
            }
        ]
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />
            <Link href="/explore" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 group">
                <div className="bg-muted p-2 rounded-xl group-hover:bg-primary/10 transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                </div>
                <span className="font-semibold text-sm">Back to Library</span>
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                {/* Left Column: Mantra Details */}
                <div className="lg:col-span-12 xl:col-span-8 space-y-12">
                    <div className="space-y-6">
                        <div className="flex flex-wrap items-center gap-3">
                            {mantra.categories && (
                                <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary text-xs py-1">
                                    {mantra.categories.name}
                                </Badge>
                            )}
                            {mantra.deity && (
                                <Badge variant="secondary" className="bg-orange-100/50 text-orange-700 dark:bg-orange-950/20 dark:text-orange-400 border-none text-xs py-1">
                                    Deity: {mantra.deity}
                                </Badge>
                            )}
                            {mantra.source && (
                                <Badge variant="outline" className="border-primary/20 bg-background text-muted-foreground text-xs py-1">
                                    Source: {mantra.source}
                                </Badge>
                            )}
                        </div>

                        <h1 className="text-4xl md:text-7xl font-serif font-black tracking-tighter leading-[0.9] mb-4">
                            {mantra.title}
                        </h1>
                    </div>

                    {/* Sacred Text Block */}
                    <div className="glass p-8 md:p-16 rounded-[4rem] relative overflow-hidden group border-primary/10 shadow-primary/5 shadow-2xl">
                        <div className="absolute top-0 right-0 p-8">
                            <Sparkles className="w-10 h-10 text-primary/20 group-hover:text-primary/40 transition-all duration-700" />
                        </div>

                        <div className="space-y-12 text-center">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                className="space-y-8"
                            >
                                <span className="text-[0.6rem] font-bold uppercase tracking-[0.5em] text-primary/60 block">Sacred Sanskrit</span>
                                <h2 className="text-4xl md:text-7xl font-display leading-[1.3] text-foreground font-medium px-4">
                                    {mantra.sanskrit_text}
                                </h2>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="space-y-4"
                            >
                                <span className="text-[0.6rem] font-black uppercase tracking-[0.3em] text-muted-foreground block">Transliteration</span>
                                <p className="text-xl md:text-2xl font-serif italic text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                                    {mantra.transliteration}
                                </p>
                            </motion.div>

                            {mantra.pronunciation && (
                                <div className="space-y-4 pt-8 border-t border-primary/10 max-w-2xl mx-auto mt-8">
                                    <div className="flex items-center justify-center gap-2 mb-2">
                                        <Volume2 className="w-4 h-4 text-primary" />
                                        <span className="text-[0.6rem] font-black uppercase tracking-[0.2em] text-primary block">Pronunciation Guide</span>
                                    </div>
                                    <p className="text-lg md:text-xl font-medium text-foreground leading-relaxed bg-primary/5 p-4 rounded-2xl border border-primary/10">
                                        &quot;{mantra.pronunciation}&quot;
                                    </p>
                                    <span className="text-xs text-muted-foreground block italic opacity-80">Listen & repeat slowly</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Translation & Benefits */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.5 }}
                            className="space-y-4 glass p-8 rounded-[2.5rem]"
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <div className="bg-primary/10 p-2 rounded-xl">
                                    <BookOpen className="w-5 h-5 text-primary" />
                                </div>
                                <h3 className="font-bold text-lg">Translation</h3>
                            </div>
                            <p className="text-muted-foreground leading-relaxed">
                                <RichTextRenderer text={mantra.translation || ''} />
                            </p>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="space-y-4 glass p-8 rounded-[2.5rem]"
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <div className="bg-green-100 dark:bg-green-950/20 p-2 rounded-xl">
                                    <Heart className="w-5 h-5 text-green-600 dark:text-green-400" />
                                </div>
                                <h3 className="font-bold text-lg">Benefits</h3>
                            </div>
                            <p className="text-muted-foreground leading-relaxed">
                                <RichTextRenderer text={mantra.benefits || ''} />
                            </p>
                        </motion.div>
                    </div>

                    <AdSlot className="mt-8 rounded-[2rem]" height={120} />
                </div>

                {/* Right Column: Interaction (Desktop sticky) */}
                <div className="lg:col-span-12 xl:col-span-4 lg:sticky lg:top-24 h-fit">
                    <JaapCounter mantraId={mantra.id} />

                    <div className="mt-8 mb-8 glass p-6 rounded-3xl flex items-center justify-between group cursor-pointer hover:bg-primary/5 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="bg-muted p-3 rounded-2xl group-hover:bg-primary/10 transition-colors">
                                <Volume2 className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                            </div>
                            <div>
                                <p className="font-bold text-sm">Listen to Chant</p>
                                <p className="text-xs text-muted-foreground">Premium audio recording</p>
                            </div>
                        </div>
                        <Badge variant="outline" className="text-[0.6rem] uppercase tracking-wider font-bold opacity-60">SOON</Badge>
                    </div>

                    <AdSlot height={600} format="rectangle" className="rounded-3xl" />
                </div>
            </div>
        </div>
    )
}
