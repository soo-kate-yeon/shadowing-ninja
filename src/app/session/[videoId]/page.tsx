'use client';

import { useEffect, useState, useRef, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { Sentence } from '@/types';
import YouTubePlayer from '@/components/YouTubePlayer';
import { SessionHeader } from '@/components/session/SessionHeader';
import { ScriptLine } from '@/components/session/ScriptLine';
import { Highlight } from '@/components/session/AnalysisPanel';

export default function SessionPage() {
    const params = useParams();
    const router = useRouter();
    const videoId = params.videoId as string;

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [sentences, setSentences] = useState<Sentence[]>([]);

    const [player, setPlayer] = useState<YT.Player | null>(null);
    const [currentTime, setCurrentTime] = useState(0);
    const activeSentenceRef = useRef<HTMLDivElement>(null);

    // UI State
    const [expandedId, setExpandedId] = useState<string | null>(null);

    // Store
    const addSession = useStore((state) => state.addSession);
    const getVideo = useStore((state) => state.getVideo);
    const video = getVideo(videoId);
    const storeHighlights = useStore((state) => state.highlights);
    const addHighlight = useStore((state) => state.addHighlight);

    // Filter highlights for this video
    const sessionHighlights = useMemo(() =>
        storeHighlights.filter(h => h.videoId === videoId),
        [storeHighlights, videoId]);

    useEffect(() => {
        if (!videoId) return;

        // Initialize session if needed
        // In a real app, we might check if it exists first, but addSession overwrites or we can check
        // For now, let's just ensure we have the video data. 
        // If we came from a direct link and don't have video data in store, we might need to fetch it.
        // But for this prototype, we assume we came from Home where video exists in store.

        const fetchTranscript = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/transcript?videoId=${videoId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch transcript');
                }
                const data = await response.json();
                setSentences(data.sentences);

                // Create/Update session in store
                addSession({
                    id: crypto.randomUUID(),
                    videoId,
                    progress: 0,
                    lastAccessedAt: Date.now(),
                    totalSentences: data.sentences.length,
                    timeLeft: video?.duration || '00:00' // Fallback or calculate
                });

            } catch (err) {
                console.error(err);
                setError('Failed to load session');
            } finally {
                setLoading(false);
            }
        };

        fetchTranscript();
    }, [videoId, addSession, video]);

    const handlePlayerReady = (playerInstance: YT.Player) => {
        setPlayer(playerInstance);
    };

    const handleTimeUpdate = (time: number) => {
        setCurrentTime(time);
    };

    const handleSeek = (startTime: number) => {
        if (player) {
            player.seekTo(startTime, true);
            player.playVideo(); // Optional: auto-play after seek
        }
    };

    const handleAddHighlight = (text: string, comment: string) => {
        addHighlight({
            id: crypto.randomUUID(),
            videoId,
            originalText: text,
            userNote: comment,
            createdAt: Date.now()
        });
    };

    // Find active sentence
    const activeSentenceIndex = sentences.findIndex(
        (s) => currentTime >= s.startTime && currentTime < s.endTime
    );

    // Auto-scroll to active sentence
    useEffect(() => {
        if (activeSentenceRef.current) {
            activeSentenceRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            });
        }
    }, [activeSentenceIndex]);

    if (loading) {
        return <div className="flex items-center justify-center h-screen bg-secondary-200 text-secondary-500">Loading Session...</div>;
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-screen gap-4 bg-secondary-200">
                <p className="text-error">{error}</p>
                <button onClick={() => router.push('/home')} className="text-primary-500 hover:underline">Go Home</button>
            </div>
        );
    }

    return (
        <div className="h-screen bg-secondary-200 flex flex-col overflow-hidden relative">
            {/* Header */}
            <SessionHeader
                title={video?.title || 'Unknown Video'}
                onBack={() => router.push('/home')}
                onNextStep={() => router.push(`/shadowing/${videoId}`)}
            />

            <main className="flex-1 flex gap-6 p-8 h-[calc(100vh-80px)]">
                {/* Left: Video Player */}
                <div className="w-1/2 h-full flex flex-col">
                    <h2 className="text-2xl font-bold text-neutral-900 leading-relaxed mb-6 tracking-tight whitespace-pre-wrap">
                        이제, 스크립트를 보며 다시 들어보세요.{'\n'}
                        어려운 문장이 있다면 클릭해서 분석해보세요.
                    </h2>

                    <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-lg">
                        <YouTubePlayer
                            videoId={videoId}
                            className="w-full h-full"
                            onReady={handlePlayerReady}
                            onTimeUpdate={handleTimeUpdate}
                        />
                    </div>
                </div>

                {/* Right: Script & Analysis */}
                <div className="w-1/2 h-full bg-secondary-50 rounded-2xl p-8 overflow-y-auto relative shadow-sm">
                    <div className="flex flex-col gap-6 pb-20">
                        {sentences.map((sentence, idx) => {
                            const isActive = idx === activeSentenceIndex;
                            // Find highlights for this sentence
                            // Simple check: if highlight text is contained in sentence text
                            const sentenceHighlights: Highlight[] = sessionHighlights
                                .filter(h => sentence.text.includes(h.originalText))
                                .map(h => ({ text: h.originalText, comment: h.userNote || '' }));

                            return (
                                <div key={sentence.id} ref={isActive ? activeSentenceRef : null}>
                                    <ScriptLine
                                        sentence={sentence}
                                        index={idx}
                                        isActive={isActive}
                                        expanded={expandedId === sentence.id}
                                        highlights={sentenceHighlights}
                                        onToggleExpand={() => setExpandedId(prev => prev === sentence.id ? null : sentence.id)}
                                        onAddHighlight={handleAddHighlight}
                                        onSeek={handleSeek}
                                    />
                                </div>
                            );
                        })}
                        {/* Extra scroll space */}
                        <div className="h-20" />
                    </div>
                </div>
            </main>
        </div>
    );
}
