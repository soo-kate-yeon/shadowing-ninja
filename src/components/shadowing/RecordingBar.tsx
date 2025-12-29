"use client";

import { Play, Pause, Mic, Square } from "lucide-react";

type RecordingState = 'idle' | 'recording' | 'playback';

interface RecordingBarProps {
    state: RecordingState;
    onRecord: () => void;
    onStop: () => void;
    onPlay: () => void;
    onPause: () => void;
    isPlaying?: boolean;
    recordingDuration?: number;
    playbackProgress?: number;
}

export function RecordingBar({
    state,
    onRecord,
    onStop,
    onPlay,
    onPause,
    isPlaying = false,
    recordingDuration = 0,
    playbackProgress = 0
}: RecordingBarProps) {
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (state === 'idle') {
        return null; // Hidden when idle
    }

    return (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
            <div className="bg-surface border border-outline rounded-2xl shadow-lg px-6 py-4 flex items-center gap-4 min-w-[400px]">
                {state === 'recording' ? (
                    <>
                        {/* Recording State */}
                        <div className="flex items-center gap-3 flex-1">
                            <div className="w-3 h-3 bg-error rounded-full animate-pulse"></div>
                            <span className="text-body-large font-medium text-neutral-900">
                                녹음 중
                            </span>
                            <span className="text-body-medium text-neutral-600 ml-auto">
                                {formatTime(recordingDuration)}
                            </span>
                        </div>
                        <button
                            onClick={onStop}
                            className="bg-primary-500 hover:bg-primary-600 text-white p-3 rounded-xl transition-colors"
                            aria-label="Stop recording"
                        >
                            <Square className="w-5 h-5" fill="currentColor" />
                        </button>
                    </>
                ) : (
                    <>
                        {/* Playback State */}
                        <div className="flex flex-col gap-2 flex-1">
                            <div className="flex items-center justify-between">
                                <span className="text-body-large font-medium text-neutral-900">
                                    녹음 완료
                                </span>
                                <span className="text-body-medium text-neutral-600">
                                    {formatTime(recordingDuration)}
                                </span>
                            </div>
                            {/* Progress Bar */}
                            <div className="w-full h-1 bg-neutral-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-primary-500 transition-all duration-100"
                                    style={{ width: `${playbackProgress}%` }}
                                />
                            </div>
                        </div>
                        <button
                            onClick={isPlaying ? onPause : onPlay}
                            className="bg-neutral-100 hover:bg-neutral-200 text-neutral-900 p-3 rounded-xl transition-colors"
                            aria-label={isPlaying ? "Pause" : "Play"}
                        >
                            {isPlaying ? (
                                <Pause className="w-5 h-5" />
                            ) : (
                                <Play className="w-5 h-5" fill="currentColor" />
                            )}
                        </button>
                        <button
                            onClick={onRecord}
                            className="bg-primary-500 hover:bg-primary-600 text-white p-3 rounded-xl transition-colors"
                            aria-label="Record again"
                        >
                            <Mic className="w-5 h-5" />
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
