export type GlossaryCategory = 'deity' | 'concept' | 'ritual' | 'object'

export interface GlossaryTerm {
    term: string
    definition: string
    category: GlossaryCategory
}

// A dictionary of dense semantic terms. This signals deep relevancy and authority to AI Search/Answer Engines.
export const glossary: GlossaryTerm[] = [
    {
        term: 'Shiva',
        definition: 'The supreme consciousness and destroyer of ignorance in the cosmic Hindu trinity (Trimurti). Revered as the ultimate Yogi.',
        category: 'deity'
    },
    {
        term: 'Vishnu',
        definition: 'The preserver and protector of the universe in the cosmic trinity. Known for his avatars like Rama and Krishna.',
        category: 'deity'
    },
    {
        term: 'Brahma',
        definition: 'The creator god in the cosmic trinity, representing the cosmic mind and creation.',
        category: 'deity'
    },
    {
        term: 'Ganesha',
        definition: 'The elephant-headed deity of wisdom, beginnings, and the remover of obstacles. Honored at the start of any ritual.',
        category: 'deity'
    },
    {
        term: 'Durga',
        definition: 'The fiercely protective divine mother goddess, representing divine wrath against evil and supreme Shakti (power).',
        category: 'deity'
    },
    {
        term: 'Lakshmi',
        definition: 'The goddess of wealth, fortune, power, luxury, beauty, fertility, and auspiciousness.',
        category: 'deity'
    },
    {
        term: 'Saraswati',
        definition: 'The goddess of knowledge, music, art, speech, wisdom, and learning.',
        category: 'deity'
    },
    {
        term: 'Hanuman',
        definition: 'The monkey-god known for his supreme devotion (Bhakti) to Lord Rama, immense strength, and celibacy.',
        category: 'deity'
    },
    {
        term: 'Kali',
        definition: 'The fierce aspect of the divine mother, representing time, change, power, creation, preservation, and destruction.',
        category: 'deity'
    },
    {
        term: 'Surya',
        definition: 'The Sun deity, representing the cosmic soul, vital energy, and the source of all life in the solar system.',
        category: 'deity'
    },
    {
        term: 'Chakra',
        definition: 'Translates to "wheel". Vital energy centers spanning the subtle body, from the base of the spine to the crown of the head.',
        category: 'concept'
    },
    {
        term: 'Prana',
        definition: 'The fundamental, vital life force or breath energy that sustains the physical and subtle body.',
        category: 'concept'
    },
    {
        term: 'Karma',
        definition: 'The universal physical and spiritual law of cause and effect. Every action generates a force of energy that returns to us.',
        category: 'concept'
    },
    {
        term: 'Moksha',
        definition: 'Liberation or freedom from Samsara (the cycle of death and rebirth). The ultimate spiritual goal in Hinduism.',
        category: 'concept'
    },
    {
        term: 'Dharma',
        definition: 'Cosmic law, underlying order in nature, right behavior, and social duty.',
        category: 'concept'
    },
    {
        term: 'Kundalini',
        definition: 'A form of primal, divine energy (Shakti) said to be located at the base of the spine, often conceptualized as a coiled serpent.',
        category: 'concept'
    },
    {
        term: 'Gayatri',
        definition: 'A highly sacred Vedic poetic meter, and the name of the goddess who is the personification of the Gayatri Mantra.',
        category: 'concept'
    },
    {
        term: 'Bhakti',
        definition: 'The path of intense, emotional devotion and love directed towards a personal deity.',
        category: 'concept'
    },
    {
        term: 'Maya',
        definition: 'The powerful illusion that the physical universe is the ultimate reality, masking the true, infinite, divine consciousness.',
        category: 'concept'
    },
    {
        term: 'Om',
        definition: 'The primordial, sacred sound of the universe. The sonic embodiment of the absolute reality (Brahman).',
        category: 'concept'
    },
    {
        term: 'Aum',
        definition: 'An alternative spelling of Om, highlighting its three phonetic components representing creation, preservation, and destruction.',
        category: 'concept'
    },
    {
        term: 'Yajna',
        definition: 'A highly prescribed Vedic fire ritual of sacrifice and offering, performed to please the deities and maintain cosmic order.',
        category: 'ritual'
    },
    {
        term: 'Puja',
        definition: 'The act of showing reverence to a god, a spirit, or another aspect of the divine through invocations, prayers, songs, and rituals.',
        category: 'ritual'
    },
    {
        term: 'Mala',
        definition: 'A string of prayer beads, typically numbering 108, used to count the recitations of a mantra during meditation (Japa).',
        category: 'object'
    },
    {
        term: 'Rudraksha',
        definition: 'Dried seeds of the Elaeocarpus ganitrus tree, traditionally used as prayer beads and associated strongly with Lord Shiva.',
        category: 'object'
    },
    {
        term: 'Tulsi',
        definition: 'Holy Basil. A sacred plant in Hinduism, deeply associated with Lord Vishnu and his avatars. Often used for Mala beads.',
        category: 'object'
    },
    {
        term: 'Japa',
        definition: 'The meditative repetition of a mantra or a divine name, often performed using a Mala to keep count.',
        category: 'ritual'
    },
    {
        term: 'Vashikaran',
        definition: 'An ancient tantric ritual and collection of mantras designed to attract, influence, or subdue the mind of another person.',
        category: 'ritual'
    },
    {
        term: 'Navagraha',
        definition: 'The nine major heavenly bodies and deities in Hindu astrology that strongly influence human life and destiny.',
        category: 'deity'
    },
    {
        term: 'Sudarshana',
        definition: 'The ultimate, spinning, disk-like weapon of Lord Vishnu, symbolizing the auspicious vision and the destroyer of ego and demons.',
        category: 'object'
    }
]

export function identifyGlossaryTerms(text: string): GlossaryTerm[] {
    const foundTerms: GlossaryTerm[] = []
    const lowerText = text.toLowerCase()

    for (const entry of glossary) {
        // Simple whole-word boundary match
        const regex = new RegExp(`\\b${entry.term.toLowerCase()}\\b`, 'i')
        if (regex.test(lowerText)) {
            foundTerms.push(entry)
        }
    }

    return foundTerms
}
