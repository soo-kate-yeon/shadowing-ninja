import { TranscriptItem, Sentence } from '@/types';

/**
 * Parse transcript items and merge them into complete sentences
 * With precise duration tracking for proper video sync
 */
export function parseTranscriptToSentences(transcriptItems: TranscriptItem[]): Sentence[] {
    const sentences: Sentence[] = [];
    let currentSentence = '';
    let currentStart = 0;
    let sentenceItems: TranscriptItem[] = []; // Track which items are in current sentence

    console.log('🔍 [Transcript Parser] Starting to parse', transcriptItems.length, 'items');

    const completeSentence = (reason: string) => {
        if (currentSentence.trim() && sentenceItems.length > 0) {
            // Calculate accurate duration:
            // Use the actual span from first item start to last item end
            const firstItem = sentenceItems[0];
            const lastItem = sentenceItems[sentenceItems.length - 1];
            const calculatedEnd = lastItem.start + lastItem.duration;
            const duration = calculatedEnd - firstItem.start;

            sentences.push({
                id: crypto.randomUUID(),
                text: currentSentence.trim(),
                start: firstItem.start,
                duration: Math.max(duration, 1),
                end: calculatedEnd,
                highlights: [],
            });

            if (sentences.length <= 5) {
                console.log(`✂️ [Parser] Sentence #${sentences.length} (${reason}):`, {
                    text: currentSentence.trim().substring(0, 60) + '...',
                    start: firstItem.start.toFixed(1) + 's',
                    duration: duration.toFixed(1) + 's',
                    items: sentenceItems.length,
                });
            }

            currentSentence = '';
            sentenceItems = [];
        }
    };

    for (let i = 0; i < transcriptItems.length; i++) {
        const item = transcriptItems[i];
        const text = item.text.trim();

        if (!text) continue;

        // Initialize start time for new sentence
        if (currentSentence === '') {
            currentStart = item.start;
        }

        // Add this item to current sentence's items
        sentenceItems.push(item);

        // Split text on sentence-ending punctuation while keeping the punctuation
        const segments = text.split(/([.!?]+)/);

        for (let j = 0; j < segments.length; j++) {
            const segment = segments[j].trim();
            if (!segment) continue;

            currentSentence += (currentSentence ? ' ' : '') + segment;

            // Check if this segment is punctuation or ends with punctuation
            const isPunctuation = /^[.!?]+$/.test(segment);
            const endsWithPunctuation = /[.!?]$/.test(segment);

            if (isPunctuation || endsWithPunctuation) {
                // Complete the sentence
                completeSentence('punctuation');

                // Start fresh for next sentence
                currentStart = item.start; // Next sentence starts from current item
            }
        }

        // Safety check: if sentence is getting too long, force break
        const wordCount = currentSentence.trim().split(/\s+/).length;
        if (wordCount >= 50) {
            completeSentence('max words');
            if (i < transcriptItems.length - 1) {
                currentStart = transcriptItems[i + 1].start;
            }
        }
    }

    // Handle any remaining text as final sentence
    if (currentSentence.trim()) {
        completeSentence('end of items');
    }

    console.log(`✅ [Parser] Created ${sentences.length} sentences from ${transcriptItems.length} items`);

    return sentences;
}

/**
 * Extract YouTube video ID from URL
 */
export function extractVideoId(url: string): string | null {
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
        /youtube\.com\/embed\/([^&\n?#]+)/,
    ];

    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) {
            return match[1];
        }
    }

    return null;
}

/**
 * Group sentences based on mode
 */
export function groupSentencesByMode(
    sentences: Sentence[],
    mode: 'sentence' | 'paragraph' | 'total'
): Sentence[] {
    if (mode === 'sentence') {
        return sentences;
    }

    if (mode === 'total') {
        if (sentences.length === 0) return [];

        const firstSentence = sentences[0];
        const lastSentence = sentences[sentences.length - 1];
        const duration = lastSentence.end - firstSentence.start;

        return [{
            id: crypto.randomUUID(),
            text: sentences.map(s => s.text).join(' '),
            start: firstSentence.start,
            duration: duration,
            end: lastSentence.end,
            highlights: [],
        }];
    }

    // Paragraph mode: 5-10 sentences
    const paragraphs: Sentence[] = [];
    let currentParagraph: Sentence[] = [];

    sentences.forEach((sentence, index) => {
        currentParagraph.push(sentence);

        const hasMinSentences = currentParagraph.length >= 5;
        const hasMaxSentences = currentParagraph.length >= 10;
        const isLastSentence = index === sentences.length - 1;

        if (hasMaxSentences || isLastSentence) {
            const firstSentence = currentParagraph[0];
            const lastSentence = currentParagraph[currentParagraph.length - 1];
            const duration = lastSentence.end - firstSentence.start;

            paragraphs.push({
                id: crypto.randomUUID(),
                text: currentParagraph.map(s => s.text).join(' '),
                start: firstSentence.start,
                duration: duration,
                end: lastSentence.end,
                highlights: [],
            });
            currentParagraph = [];
        }
    });

    return paragraphs;
}
