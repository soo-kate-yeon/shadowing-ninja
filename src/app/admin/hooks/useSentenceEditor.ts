import { useState } from 'react';
import { Sentence } from '@/types';

export interface UseSentenceEditorReturn {
    sentences: Sentence[];
    setSentences: React.Dispatch<React.SetStateAction<Sentence[]>>;
    updateSentenceTime: (id: string, field: 'startTime' | 'endTime', value: number) => void;
    updateSentenceText: (id: string, field: 'text' | 'translation', value: string) => void;
    deleteSentence: (index: number) => void;
}

/**
 * Custom hook for managing sentence list CRUD operations
 */
export function useSentenceEditor(initialSentences: Sentence[] = []): UseSentenceEditorReturn {
    const [sentences, setSentences] = useState<Sentence[]>(initialSentences);

    const updateSentenceTime = (id: string, field: 'startTime' | 'endTime', value: number) => {
        setSentences(prev => prev.map(s =>
            s.id === id ? { ...s, [field]: value } : s
        ));
    };

    const updateSentenceText = (id: string, field: 'text' | 'translation', value: string) => {
        setSentences(prev => prev.map(s =>
            s.id === id ? { ...s, [field]: value } : s
        ));
    };

    const deleteSentence = (index: number) => {
        setSentences(prev => {
            const next = [...prev];
            next.splice(index, 1);
            return next;
        });
    };

    return {
        sentences,
        setSentences,
        updateSentenceTime,
        updateSentenceText,
        deleteSentence,
    };
}
