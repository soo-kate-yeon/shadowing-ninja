'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Sentence } from '@/types';

export default function SessionPage() {
    const params = useParams();
    const router = useRouter();
    const videoId = params.videoId as string;

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [sentences, setSentences] = useState<Sentence[]>([]);

    const addSession = useStore((state) => state.addSession);
    const getVideo = useStore((state) => state.getVideo);
    const video = getVideo(videoId);

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

    if (loading) {
        return <div className="flex items-center justify-center h-screen">Loading Session...</div>;
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-screen gap-4">
                <p className="text-red-500">{error}</p>
                <Button onClick={() => router.push('/home')}>Go Home</Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <header className="h-16 border-b flex items-center px-6 justify-between">
                <h1 className="font-semibold text-lg">{video?.title || 'Unknown Video'}</h1>
                <Button variant="ghost" onClick={() => router.push('/home')}>Exit</Button>
            </header>
            <main className="flex-1 p-6 flex gap-6">
                {/* Video Player Placeholder */}
                <div className="flex-1 bg-black rounded-xl flex items-center justify-center text-white">
                    Video Player ({videoId})
                </div>

                {/* Transcript / Controls Placeholder */}
                <div className="w-[400px] bg-secondary-100 rounded-xl p-4 overflow-y-auto">
                    <h2 className="font-semibold mb-4">Transcript ({sentences.length} sentences)</h2>
                    <div className="flex flex-col gap-2">
                        {sentences.map((sentence, idx) => (
                            <div key={sentence.id} className="p-2 hover:bg-white rounded-lg cursor-pointer transition-colors">
                                <span className="text-xs text-gray-500 font-mono mr-2">
                                    {idx + 1}.
                                </span>
                                {sentence.text}
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
