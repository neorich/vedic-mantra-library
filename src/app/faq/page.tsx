import { Badge } from '@/components/ui/badge'
import { BookOpen, HelpCircle } from 'lucide-react'
import { Metadata } from 'next'
import { AdSlot } from '@/components/ad-slot'

export const metadata: Metadata = {
    title: 'FAQ | Vedic Mantra Library',
    description: 'Frequently asked questions about Sanskrit mantras, how to chant, what is a Jaap, and the significance of 108.',
}

const faqs = [
    {
        question: "What exactly is a Mantra?",
        answer: "A mantra is a sacred utterance, a numinous sound, a syllable, word or phonemes, or group of words in Sanskrit believed by practitioners to have psychological and spiritual powers. Rooted in the ancient Vedic tradition, mantras are considered sacred formulas that contain the concentrated essence of spiritual energy."
    },
    {
        question: "How should I properly chant a mantra?",
        answer: "Chant slowly, focusing entirely on the vibration of the sound rather than rushing to finish. Ensure your pronunciation is as accurate as possible by following our phonetic guides. Maintain a state of calm devotion, ideally sitting in a clean space with a straight spine. Physical cleanliness and mental purity amplify the effects."
    },
    {
        question: "What is a Jaap (Japa)?",
        answer: "A Jaap (or Japa) is the deeply meditative, continuous repetition of a mantra or a divine name. It is traditionally performed using a Japa mala (a beaded rosary) to count the repetitions, anchoring the wandering mind firmly to the present moment and the vibrational frequency of the chant."
    },
    {
        question: "Why are mantras usually chanted 108 times?",
        answer: "The number 108 is profoundly sacred in Hinduism, Buddhism, and yogic traditions. It represents the absolute wholeness of existence: 1 signifies God or Higher Truth, 0 signifies emptiness or completeness in spiritual practice, and 8 signifies infinity or eternity. There are also 108 major Upanishads and 108 Marmas (vital points) in the subtle body."
    },
    {
        question: "Do I need to be initiated by a Guru to chant these?",
        answer: "While certain highly guarded tantric or specialized seed (beeja) mantras require formal initiation (diksha) from an authentic Guru, the vast majority of healing, planetary, and devotional mantras provided in our library are universally accessible. Anyone approaching them with deep respect and a pure heart will experience their profound benefits."
    },
    {
        question: "Can listening to mantras be as effective as reciting them?",
        answer: "Listening to mantras (Shravanam) is highly beneficial and purifies the surrounding environment, bringing immense peace to the listener. However, active recitation (Kirtanam or Japa) engages your own vocal cords and bodily vibrations, making it significantly more powerful for personal spiritual transformation."
    }
]

export default function FAQPage() {
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
            }
        }))
    }

    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />

            <div className="space-y-4 mb-12 text-center md:text-left">
                <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary">
                    <HelpCircle className="w-3 h-3 mr-2" />
                    Knowledge Base
                </Badge>
                <h1 className="text-4xl md:text-6xl font-serif font-black tracking-tight">
                    Frequently Asked <span className="text-gradient">Questions</span>
                </h1>
                <p className="text-muted-foreground text-lg max-w-2xl font-serif italic mx-auto md:mx-0">
                    Understanding the ancient science and spiritual mechanics of Vedic mantras.
                </p>
            </div>

            <AdSlot className="mb-12 rounded-[2rem]" height={120} />

            <div className="space-y-8">
                {faqs.map((faq, index) => (
                    <div key={index} className="glass p-8 md:p-10 rounded-[2.5rem] relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                            <BookOpen className="w-16 h-16 text-primary" />
                        </div>
                        <h2 className="text-2xl font-bold font-serif mb-4 text-foreground pr-12">
                            {faq.question}
                        </h2>
                        <p className="text-muted-foreground leading-relaxed text-lg">
                            {faq.answer}
                        </p>
                    </div>
                ))}
            </div>

            <AdSlot className="mt-12 rounded-[2rem]" height={120} />
        </div>
    )
}
