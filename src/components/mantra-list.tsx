'use client'

import { motion } from 'framer-motion'
import { MantraCard } from './mantra-card'

interface MantraListProps {
    mantras: any[]
}

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
}

const item: any = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
}

export function MantraList({ mantras }: MantraListProps) {
    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
            {mantras.map((mantra) => (
                <motion.div key={mantra.id} variants={item}>
                    <MantraCard mantra={mantra} />
                </motion.div>
            ))}
        </motion.div>
    )
}
