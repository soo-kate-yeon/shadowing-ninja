"use client";

import { Play, Pause, Square, Globe, Bookmark, X, Check, Mic } from "lucide-react";

type RecordingState = 'idle' | 'recording' | 'playback';

interface RecordingBarProps {
    state: RecordingState;
    onRecord: () => void;
    onStop: () => void;
    onPlay: () => void;
    onPause: () => void;
    onCancel?: () => void;
    onDone?: () => void;
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
    onCancel,
    onDone,
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
        <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 z-50 flex items-center justify-center w-full px-4">
            <div className="bg-black/80 backdrop-blur-md border border-white/10 rounded-full pl-2 pr-6 py-2 flex items-center gap-6 shadow-2xl min-w-[600px] max-w-3xl">

                {/* Left Control Button */}
                <div className="shrink-0">
                    {state === 'recording' ? (
                        <button
                            onClick={onStop}
                            className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors group"
                            aria-label="Stop recording"
                        >
                            <Square className="w-5 h-5 text-white fill-white group-hover:scale-90 transition-transform" />
                        </button>
                    ) : (
                        <button
                            onClick={isPlaying ? onPause : onPlay}
                            className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors group"
                            aria-label={isPlaying ? "Pause" : "Play"}
                        >
                            {isPlaying ? (
                                <Pause className="w-5 h-5 text-white fill-white" />
                            ) : (
                                <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                            )}
                        </button>
                    )}
                </div>

                {/* Center Content */}
                <div className="flex-1 flex items-center gap-6 min-w-0">
                    {state === 'recording' ? (
                        /* Recording Status */
                        <div className="flex items-center gap-3 flex-1">
                            {/* Visualizer Mock */}
                            <div className="flex gap-1 items-end h-6 mx-2">
                                {[1, 2, 3, 2, 4, 1, 2].map((h, i) => (
                                    <div
                                        key={i}
                                        className="w-1 bg-primary-500 rounded-full animate-pulse"
                                        style={{
                                            height: `${h * 4}px`,
                                            animationDelay: `${i * 0.1}s`
                                        }}
                                    />
                                ))}
                            </div>
                            <span className="text-white font-medium whitespace-nowrap">
                                Recording... {formatTime(recordingDuration)}
                            </span>

                            {/* Divider & Extra Info (Mock) */}
                            <div className="h-4 w-px bg-white/10 mx-2" />
                            <div className="flex items-center gap-4 text-white/60 text-sm hidden sm:flex">
                                <span className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer">
                                    <Globe className="w-4 h-4" />
                                    English
                                </span>
                                <span className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer">
                                    <Bookmark className="w-4 h-4" />
                                    Bookmark
                                </span>
                            </div>
                        </div>
                    ) : (
                        /* Playback Progress */
                        <div className="flex flex-col justify-center flex-1 gap-1.5">
                            <div className="flex items-center justify-between text-xs font-medium px-1">
                                <span className="text-white">Reviewing</span>
                                <span className="text-white/60">{formatTime(recordingDuration)}</span>
                            </div>
                            <div className="relative w-full h-1.5 bg-white/10 rounded-full overflow-hidden cursor-pointer group">
                                <div
                                    className="absolute inset-y-0 left-0 bg-primary-500 rounded-full transition-all duration-100 ease-linear group-hover:bg-primary-400"
                                    style={{ width: `${playbackProgress}%` }}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-4 pl-4 border-l border-white/10 shrink-0">
                    {state === 'playback' && (
                        <button
                            onClick={onRecord}
                            className="text-white/70 hover:text-white text-sm font-medium transition-colors flex items-center gap-1"
                        >
                            <Mic className="w-4 h-4" />
                            Re-record
                        </button>
                    )}

                    <button
                        onClick={onCancel}
                        className="text-white/70 hover:text-error text-sm font-medium transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onDone}
                        className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-1.5 rounded-full text-sm font-medium transition-colors shadow-lg shadow-primary-500/20"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
}
