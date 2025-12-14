'use client';

import { useState, useEffect } from 'react';
import TopNav from '@/components/TopNav';
import HighlightCard from '@/components/HighlightCard';
import { useStore } from '@/lib/store';
import { toast } from 'sonner';

export default function ArchivePage() {
    const highlights = useStore((state) => state.highlights);
    const removeHighlight = useStore((state) => state.removeHighlight);
    const addHighlight = useStore((state) => state.addHighlight);
    const savedSentences = useStore((state) => state.savedSentences);
    const removeSavedSentence = useStore((state) => state.removeSavedSentence);
    const addSavedSentence = useStore((state) => state.addSavedSentence);
    const getVideo = useStore((state) => state.getVideo);

    // Hydration fix
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleDeleteHighlight = (highlightId: string) => {
        const highlight = highlights.find(h => h.id === highlightId);
        if (!highlight) return;

        removeHighlight(highlightId);

        toast("하이라이트가 삭제되었습니다.", {
            action: {
                label: "실행 취소",
                onClick: () => {
                    addHighlight(highlight);
                },
            },
        });
    };

    const handleDeleteSavedSentence = (sentenceId: string) => {
        const sentence = savedSentences.find(s => s.id === sentenceId);
        if (!sentence) return;

        removeSavedSentence(sentenceId);

        toast("저장한 문장이 삭제되었습니다.", {
            action: {
                label: "실행 취소",
                onClick: () => {
                    addSavedSentence(sentence);
                },
            },
        });
    };

    const aiNotes = useStore((state) => state.aiNotes);
    const removeAINote = useStore((state) => state.removeAINote);
    const addAINote = useStore((state) => state.addAINote);

    const handleDeleteAINote = (noteId: string) => {
        const note = aiNotes.find(n => n.id === noteId);
        if (!note) return;

        removeAINote(noteId);

        toast("AI 노트가 삭제되었습니다.", {
            action: {
                label: "실행 취소",
                onClick: () => {
                    addAINote(note);
                },
            },
        });
    };

    if (!isMounted) {
        return null;
    }

    return (
        <div className="min-h-screen bg-secondary-200 flex flex-col">
            <TopNav />
            <main className="flex-1 max-w-[1920px] w-full mx-auto p-8 flex flex-col gap-6 h-[calc(100vh-80px)] overflow-hidden">
                {/* 3-column layout: AI Notes, Saved Sentences, Highlights */}
                <div className="flex flex-row gap-6 items-start h-full">

                    {/* Left Column: AI Notes */}
                    <section className="flex flex-col gap-4 w-[33%] h-full">
                        <h2 className="text-2xl font-semibold text-black shrink-0">AI 노트</h2>
                        <div className="flex-1 min-h-0 overflow-y-auto pr-2">
                            {aiNotes.length > 0 ? (
                                <div className="flex flex-col gap-4 pb-4">
                                    {aiNotes.map((note) => {
                                        const video = getVideo(note.videoId);
                                        return (
                                            <div key={note.id} className="bg-white rounded-xl p-5 border border-secondary-200 shadow-sm flex flex-col gap-4">
                                                {/* Header */}
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        {video && (
                                                            <p className="text-xs text-secondary-500 mb-1 line-clamp-1">
                                                                {video.title}
                                                            </p>
                                                        )}
                                                        <p className="text-lg font-medium text-neutral-900 line-clamp-2">
                                                            "{note.sentenceText}"
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={() => handleDeleteAINote(note.id)}
                                                        className="text-secondary-400 hover:text-error transition-colors p-1"
                                                        aria-label="Delete note"
                                                    >
                                                        <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M6 6L14 14M6 14L14 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                                        </svg>
                                                    </button>
                                                </div>

                                                {/* Feedback Tags */}
                                                <div className="flex gap-2 flex-wrap">
                                                    {note.userFeedback.map(fb => (
                                                        <span key={fb} className="px-2 py-1 bg-secondary-50 text-secondary-600 text-xs rounded-md border border-secondary-100">
                                                            {fb === 'too_fast' && '속도가 빨라요'}
                                                            {fb === 'unknown_words' && '모르는 단어'}
                                                            {fb === 'linking_sounds' && '연음'}
                                                        </span>
                                                    ))}
                                                </div>

                                                <div className="h-px bg-secondary-100" />

                                                {/* AI Content */}
                                                <div className="flex flex-col gap-3">
                                                    <div className="flex gap-2 items-start">
                                                        <span className="text-lg">🧐</span>
                                                        <div>
                                                            <p className="text-xs font-semibold text-secondary-500 mb-0.5">분석</p>
                                                            <p className="text-sm text-secondary-700 leading-relaxed">{note.aiResponse.analysis}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2 items-start">
                                                        <span className="text-lg">💡</span>
                                                        <div>
                                                            <p className="text-xs font-semibold text-secondary-500 mb-0.5">팁</p>
                                                            <p className="text-sm text-secondary-700 leading-relaxed">{note.aiResponse.tips}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2 items-start bg-primary-50 p-3 rounded-lg">
                                                        <span className="text-lg">🎯</span>
                                                        <div>
                                                            <p className="text-xs font-semibold text-primary-600 mb-0.5">집중 포인트</p>
                                                            <p className="text-sm text-primary-700 font-medium">{note.aiResponse.focusPoint}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-neutral-500 bg-secondary-50 rounded-xl border border-dashed border-secondary-300 p-8">
                                    <p className="text-xl">저장된 AI 노트가 없어요.</p>
                                    <p className="text-base mt-2 text-center">학습 중 AI의 분석을 저장하면 여기에 표시됩니다.</p>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Middle Column: Saved Sentences */}
                    <section className="flex flex-col gap-4 w-[33%] h-full">
                        <h2 className="text-2xl font-semibold text-black shrink-0">저장한 문장</h2>
                        <div className="flex-1 min-h-0 overflow-y-auto pr-2">
                            {savedSentences.length > 0 ? (
                                <div className="flex flex-col gap-4 pb-4">
                                    {savedSentences.map((sentence) => {
                                        const video = getVideo(sentence.videoId);
                                        return (
                                            <div key={sentence.id} className="bg-secondary-50 rounded-xl p-4">
                                                {video && (
                                                    <p className="text-sm text-secondary-500 mb-2">
                                                        {video.title}
                                                    </p>
                                                )}
                                                <div className="flex items-start justify-between gap-4">
                                                    <p className="text-lg text-neutral-900 leading-relaxed flex-1">
                                                        {sentence.sentenceText}
                                                    </p>
                                                    <button
                                                        onClick={() => handleDeleteSavedSentence(sentence.id)}
                                                        className="text-secondary-500 hover:text-error transition-colors"
                                                        aria-label="Delete saved sentence"
                                                    >
                                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M6 6L14 14M6 14L14 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-neutral-500 bg-secondary-50 rounded-xl border border-dashed border-secondary-300 p-8">
                                    <p className="text-xl">아직 저장한 문장이 없어요.</p>
                                    <p className="text-base mt-2 text-center">학습 중 집중 연습하고 싶은 문장을 저장하면 여기에 표시됩니다.</p>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Right Column: Highlights */}
                    <section className="flex flex-col gap-4 w-[34%] h-full">
                        <h2 className="text-2xl font-semibold text-black shrink-0">하이라이트</h2>
                        <div className="flex-1 min-h-0 overflow-y-auto pr-2">
                            {highlights.length > 0 ? (
                                <div className="flex flex-col gap-4 pb-4">
                                    {highlights.map((highlight) => {
                                        const video = getVideo(highlight.videoId);
                                        return (
                                            <div key={highlight.id} className="bg-secondary-50 rounded-xl p-4">
                                                {video && (
                                                    <p className="text-sm text-secondary-500 mb-2">
                                                        {video.title}
                                                    </p>
                                                )}
                                                <HighlightCard
                                                    highlightedSentence={highlight.originalText}
                                                    userCaption={highlight.userNote}
                                                    onDelete={() => handleDeleteHighlight(highlight.id)}
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-neutral-500 bg-secondary-50 rounded-xl border border-dashed border-secondary-300 p-8">
                                    <p className="text-xl">아직 저장된 하이라이트가 없어요.</p>
                                    <p className="text-base mt-2 text-center">학습 중 중요한 표현을 하이라이트하면 여기에 저장됩니다.</p>
                                </div>
                            )}
                        </div>
                    </section>

                </div>
            </main>
        </div>
    );
}
