import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Video {
    id: string;
    title: string;
    thumbnailUrl: string;
    duration: string;
    description: string;
    sentenceCount?: number;
}

export interface Session {
    id: string;
    videoId: string;
    progress: number; // 0-100
    lastAccessedAt: number;
    totalSentences: number;
    timeLeft: string;
}

export interface Highlight {
    id: string;
    videoId: string;
    originalText: string;
    userNote?: string;
    createdAt: number;
}

interface AppState {
    videos: Video[];
    sessions: Record<string, Session>; // Keyed by videoId
    highlights: Highlight[];

    // Actions
    addSession: (session: Session) => void;
    updateSessionProgress: (videoId: string, progress: number) => void;
    addHighlight: (highlight: Highlight) => void;
    getVideo: (videoId: string) => Video | undefined;
}

// Initial Mock Data
const INITIAL_VIDEOS: Video[] = [
    {
        id: 'qp0HIF3SfI4',
        title: 'How great leaders inspire action | Simon Sinek',
        thumbnailUrl: 'https://img.youtube.com/vi/qp0HIF3SfI4/maxresdefault.jpg',
        duration: '18:04',
        description: 'Simon Sinek has a simple but powerful model for inspirational leadership - starting with a golden circle and the question: "Why?"',
        sentenceCount: 58
    }
];

export const useStore = create<AppState>()(
    persist(
        (set, get) => ({
            videos: INITIAL_VIDEOS,
            sessions: {},
            highlights: [],

            addSession: (session) =>
                set((state) => ({
                    sessions: { ...state.sessions, [session.videoId]: session }
                })),

            updateSessionProgress: (videoId, progress) =>
                set((state) => {
                    const session = state.sessions[videoId];
                    if (!session) return state;
                    return {
                        sessions: {
                            ...state.sessions,
                            [videoId]: { ...session, progress, lastAccessedAt: Date.now() }
                        }
                    };
                }),

            addHighlight: (highlight) =>
                set((state) => ({
                    highlights: [...state.highlights, highlight]
                })),

            getVideo: (videoId) => get().videos.find((v) => v.id === videoId),
        }),
        {
            name: 'shadowing-ninja-storage',
        }
    )
);
