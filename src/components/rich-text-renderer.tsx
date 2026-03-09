import React from 'react';
import { glossary } from '@/lib/glossary';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';

interface RichTextRendererProps {
    text: string;
    className?: string;
}

export function RichTextRenderer({ text, className = "" }: RichTextRendererProps) {
    if (!text) return null;

    // Use a regex to match any of the glossary terms as whole words.
    // Escape terms to be safe in regex.
    const escapeRegExp = (string: string) => {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    // Sort by length descending so longer phrases match before their sub-phrases
    const sortedTerms = [...glossary].sort((a, b) => b.term.length - a.term.length);
    const termRegexStr = sortedTerms.map(t => escapeRegExp(t.term)).join('|');

    // Create a RegExp that splits the text by the glossary terms, matching case-insensitively
    const regex = new RegExp(`\\b(${termRegexStr})\\b`, 'gi');

    // Split the text. The matched terms will be included in the array as every odd index.
    const parts = text.split(regex);

    return (
        <span className={className}>
            {parts.map((part, i) => {
                // Determine if this part is a glossary term (every odd index in the split array)
                if (i % 2 !== 0) {
                    const lowerPart = part.toLowerCase();
                    const entry = glossary.find(g => g.term.toLowerCase() === lowerPart);

                    if (entry) {
                        return (
                            <Tooltip key={i}>
                                <TooltipTrigger>
                                    <span className="inline-block px-1 mx-0.5 rounded-sm bg-primary/10 text-primary border-b border-primary/30 border-dashed cursor-help transition-colors hover:bg-primary/20">
                                        {part}
                                    </span>
                                </TooltipTrigger>
                                <TooltipContent side="top" className="max-w-xs p-4 bg-background/95 backdrop-blur-md border border-primary/20 shadow-xl rounded-xl">
                                    <div className="space-y-1.5 flex flex-col">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold font-serif text-lg text-foreground">{entry.term}</span>
                                            <span className="text-[0.6rem] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground">
                                                {entry.category}
                                            </span>
                                        </div>
                                        <p className="text-sm text-foreground/80 leading-snug">
                                            {entry.definition}
                                        </p>
                                    </div>
                                </TooltipContent>
                            </Tooltip>
                        );
                    }
                }
                // Return non-matching text parts normally
                return <React.Fragment key={i}>{part}</React.Fragment>;
            })}
        </span>
    );
}
