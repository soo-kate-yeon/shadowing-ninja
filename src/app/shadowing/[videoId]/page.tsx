'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { groupSentencesByMode } from '@/lib/transcript-parser';
import { Sentence, LearningSession } from '@/types';
import { useQuery } from '@tanstack/react-query';
import YouTubePlayer from '@/components/YouTubePlayer';
import { ShadowingHeader } from '@/components/shadowing/ShadowingHeader';
import { ShadowingScriptList } from '@/components/shadowing/ShadowingScriptList';
import { RecordingBar } from '@/components/shadowing/RecordingBar';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';
import { Check } from 'lucide-react';

export default function ShadowingPage() {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const videoId = params.videoId as string;
    const sessionId = searchParams.get('sessionId');

    const [error, setError] = useState<string | null>(null);
    const [sentences, setSentences] = useState<Sentence[]>([]);
    const [mode, setMode] = useState<"sentence" | "paragraph" | "total">("sentence");

    // Player State
    const [player, setPlayer] = useState<YT.Player | null>(null);
    const [currentPlayingId, setCurrentPlayingId] = useState<string | null>(null);
    const playTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Loop State
    const [loopingSentenceId, setLoopingSentenceId] = useState<string | null>(null);

    // Audio Recording Hook
    const {
        recordingState,
        duration: recordingDuration,
        isPlaying: isRecordingPlaying,
        playbackProgress,
        startRecording,
        stopRecording,
        playRecording,
        pauseRecording,
        resetRecording
    } = useAudioRecorder();

    // Data Fetching with useQuery
    const { data: sessionData, isLoading: isLoadingSession } = useQuery({
        queryKey: ['session', sessionId],
        queryFn: async () => {
            const response = await fetch(`/api/learning-sessions?sessionId=${sessionId}`);
            if (!response.ok) throw new Error('Session not found');
            const result = await response.json();
            return result.sessions?.[0] as LearningSession;
        },
        enabled: !!sessionId,
        staleTime: 5 * 60 * 1000,
    });

    const { data: curatedVideoData, isLoading: isLoadingVideo } = useQuery({
        queryKey: ['video', videoId],
        queryFn: async () => {
            const response = await fetch(`/api/curated-videos/${videoId}`);
            if (!response.ok) throw new Error('Failed to fetch curated video');
            return response.json();
        },
        enabled: !sessionId && !!videoId,
        staleTime: 5 * 60 * 1000,
    });

    const isLoading = sessionId ? isLoadingSession : isLoadingVideo;

    // Derived video data and sentences
    const videoData = sessionId ? (sessionData ? {
        title: sessionData.title,
        snippet_start_time: sessionData.start_time,
        snippet_end_time: sessionData.end_time,
        snippet_duration: sessionData.duration
    } : null) : curatedVideoData;

    const rawSentences = sessionId ? (sessionData?.sentences || []) : (curatedVideoData?.transcript || []);

    useEffect(() => {
        if (rawSentences.length > 0) {
            setSentences(groupSentencesByMode(rawSentences, mode));
        }
    }, [mode, rawSentences]);

    const handlePlayerReady = (playerInstance: YT.Player) => {
        setPlayer(playerInstance);
    };

    const handlePlaySentence = (startTime: number, endTime: number) => {
        if (!player) return;

        if (playTimeoutRef.current) {
            clearTimeout(playTimeoutRef.current);
        }

        const sentence = sentences.find(s => s.startTime === startTime);
        if (sentence) {
            setCurrentPlayingId(sentence.id);
        }

        player.seekTo(startTime, true);
        player.playVideo();

        const duration = (endTime - startTime) * 1000;
        playTimeoutRef.current = setTimeout(() => {
            player.pauseVideo();
            setCurrentPlayingId(null);
        }, duration);
    };

    const handleLoopSentence = (sentenceId: string, isLooping: boolean) => {
        if (isLooping) {
            setLoopingSentenceId(sentenceId);
            const sentence = sentences.find(s => s.id === sentenceId);
            if (sentence && player) {
                player.seekTo(sentence.startTime, true);
                player.playVideo();
            }
        } else {
            setLoopingSentenceId(null);
        }
    };

    // Loop playback effect
    useEffect(() => {
        if (!loopingSentenceId || !player) return;

        const loopingSentence = sentences.find(s => s.id === loopingSentenceId);
        if (!loopingSentence) return;

        const checkLoop = setInterval(() => {
            if (player && player.getCurrentTime) {
                const currentTime = player.getCurrentTime();
                if (currentTime >= loopingSentence.endTime) {
                    player.seekTo(loopingSentence.startTime, true);
                    player.playVideo();
                }
            }
        }, 100);

        return () => clearInterval(checkLoop);
    }, [loopingSentenceId, player, sentences]);

    const handleRecordSentence = async (sentenceId: string) => {
        // 1. 영상 재생 중지
        if (player) {
            player.pauseVideo();
            setCurrentPlayingId(null);
        }

        // 2. 루프 해제
        if (loopingSentenceId) {
            setLoopingSentenceId(null);
        }

        // 3. 녹음 시작 (startRecording 내부에서 이전 녹음 정리)
        await startRecording();
    };

    // 다시 녹음 핸들러 (RecordingBar에서 사용)
    const handleReRecord = async () => {
        // 영상 정지
        if (player) {
            player.pauseVideo();
            setCurrentPlayingId(null);
        }
        // 루프 해제
        if (loopingSentenceId) {
            setLoopingSentenceId(null);
        }
        // 녹음 시작
        await startRecording();
    };

    if (isLoading) {
        return <div className="flex items-center justify-center h-screen bg-secondary-200 text-secondary-500">Loading Shadowing...</div>;
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
            <ShadowingHeader
                title={videoData?.title || 'Loading...'}
                onBack={() => router.push('/home')}
                onPrevStep={() => router.push(`/listening/${videoId}${sessionId ? `?sessionId=${sessionId}` : ''}`)}
                onNextStep={() => { }} // TODO: Next step
            />

            <main className="flex-1 flex gap-6 p-8 h-[calc(100vh-80px)]">
                {/* Left: Video Player */}
                <div className="w-1/2 h-full flex flex-col">
                    <h2 className="text-2xl font-bold text-neutral-900 leading-relaxed mb-6 tracking-tight whitespace-pre-wrap">
                        문장을 선택하고 쉐도잉을 연습하세요
                    </h2>

                    <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-lg">
                        <YouTubePlayer
                            videoId={videoId}
                            className="w-full h-full"
                            onReady={handlePlayerReady}
                            disableSpacebarControl={true}
                            startSeconds={videoData?.snippet_start_time}
                            endSeconds={videoData?.snippet_end_time}
                        />
                    </div>
                </div>

                {/* Right: Shadowing Script & Tools */}
                <div className="w-1/2 h-full bg-secondary-50 rounded-2xl p-8 overflow-hidden flex flex-col shadow-sm">
                    {/* Mode Toggles */}
                    <div className="flex gap-3 mb-6 shrink-0">
                        <button
                            onClick={() => setMode("sentence")}
                            className={`px-3 py-2 rounded-lg text-body-large font-medium flex items-center gap-2 transition-colors ${mode === 'sentence' ? 'bg-neutral-800 text-neutral-50' : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'}`}
                        >
                            {mode === 'sentence' && <Check className="w-4 h-4" />}
                            한 문장씩
                        </button>
                        <button
                            onClick={() => setMode("paragraph")}
                            className={`px-3 py-2 rounded-lg text-body-large font-medium flex items-center gap-2 transition-colors ${mode === 'paragraph' ? 'bg-neutral-800 text-neutral-50' : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'}`}
                        >
                            {mode === 'paragraph' && <Check className="w-4 h-4" />}
                            한 문단씩
                        </button>
                        <button
                            onClick={() => setMode("total")}
                            className={`px-3 py-2 rounded-lg text-body-large font-medium flex items-center gap-2 transition-colors ${mode === 'total' ? 'bg-neutral-800 text-neutral-50' : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'}`}
                        >
                            {mode === 'total' && <Check className="w-4 h-4" />}
                            전체
                        </button>
                    </div>

                    {/* Script List */}
                    <div className="flex-1 overflow-y-auto pb-20">
                        <ShadowingScriptList
                            sentences={sentences}
                            mode={mode}
                            onPlaySentence={handlePlaySentence}
                            onLoopSentence={handleLoopSentence}
                            onRecordSentence={handleRecordSentence}
                            loopingSentenceId={loopingSentenceId}
                        />
                    </div>
                </div>
            </main>

            {/* Recording Bar */}
            <RecordingBar
                state={recordingState}
                onRecord={handleReRecord}
                onStop={stopRecording}
                onPlay={playRecording}
                onPause={pauseRecording}
                onCancel={resetRecording}
                onDone={resetRecording}
                isPlaying={isRecordingPlaying}
                recordingDuration={recordingDuration}
                playbackProgress={playbackProgress}
            />
        </div>
    );
}
