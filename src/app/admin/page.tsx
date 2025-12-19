'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { extractVideoId } from '@/lib/transcript-parser';

export default function AdminPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    // Form state
    const [youtubeUrl, setYoutubeUrl] = useState('');
    const [startTime, setStartTime] = useState('0:00');
    const [endTime, setEndTime] = useState('3:00');
    const [transcript, setTranscript] = useState('');
    const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');
    const [tags, setTags] = useState('');

    // Parse time string (MM:SS or M:SS) to seconds
    const parseTime = (timeStr: string): number => {
        const parts = timeStr.split(':').map(p => parseInt(p));
        if (parts.length === 2) {
            return parts[0] * 60 + parts[1];
        }
        return 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        const videoId = extractVideoId(youtubeUrl);
        if (!videoId) {
            setError('Invalid YouTube URL');
            return;
        }

        const startSeconds = parseTime(startTime);
        const endSeconds = parseTime(endTime);
        const duration = endSeconds - startSeconds;

        if (duration > 180) {
            setError('Snippet duration must be 3 minutes or less');
            return;
        }

        if (duration <= 0) {
            setError('End time must be after start time');
            return;
        }

        if (!transcript.trim()) {
            setError('Transcript is required');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('/api/admin/curated-videos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    youtube_url: youtubeUrl,
                    snippet_start_time: startSeconds,
                    snippet_end_time: endSeconds,
                    transcript_text: transcript,
                    difficulty,
                    tags: tags.split(',').map(t => t.trim()).filter(Boolean),
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to create curated video');
            }

            setSuccess(true);
            // Reset form
            setYoutubeUrl('');
            setStartTime('0:00');
            setEndTime('3:00');
            setTranscript('');
            setTags('');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-secondary-200 p-8">
            <div className="max-w-2xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-heading-1 text-secondary-900 mb-2">Admin - Add Curated Content</h1>
                    <p className="text-body-large text-secondary-600">
                        Add educational video snippets (max 3 minutes)
                    </p>
                </div>

                {/* Guide Card */}
                <div className="bg-primary-50 border border-primary-200 rounded-2xl p-6 mb-6">
                    <h2 className="text-heading-3 text-primary-900 mb-3">📝 How to Download Transcripts</h2>
                    <ol className="list-decimal list-inside space-y-2 text-body-base text-secondary-800">
                        <li>Open the YouTube video in your browser</li>
                        <li>Click the <strong>"..."</strong> (More) button below the video</li>
                        <li>Select <strong>"Show transcript"</strong></li>
                        <li><strong>Keep timestamps ON</strong> (very important!)</li>
                        <li>Select the text for your desired time range</li>
                        <li>Copy and paste into the form below</li>
                    </ol>
                    <div className="mt-3 p-3 bg-white rounded text-xs font-mono">
                        Example format:<br />
                        0:15 Hello everyone<br />
                        0:23 Welcome to the show<br />
                        1:05 Today we're going to discuss...
                    </div>
                </div>

                {error && (
                    <div className="bg-error/10 border border-error rounded-lg p-4 mb-6">
                        <p className="text-error">{error}</p>
                    </div>
                )}

                {success && (
                    <div className="bg-success/10 border border-success rounded-lg p-4 mb-6">
                        <p className="text-success">✅ Curated video added successfully!</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="bg-surface rounded-2xl p-6 space-y-6">
                    {/* YouTube URL */}
                    <div>
                        <label className="block text-body-large font-medium text-secondary-900 mb-2">
                            YouTube URL
                        </label>
                        <input
                            type="text"
                            value={youtubeUrl}
                            onChange={(e) => setYoutubeUrl(e.target.value)}
                            placeholder="https://youtube.com/watch?v=..."
                            className="w-full px-4 py-3 rounded-lg border border-secondary-300 focus:outline-none focus:border-primary-500"
                            required
                        />
                    </div>

                    {/* Time Range */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-body-large font-medium text-secondary-900 mb-2">
                                Start Time (M:SS)
                            </label>
                            <input
                                type="text"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                placeholder="0:00"
                                className="w-full px-4 py-3 rounded-lg border border-secondary-300 focus:outline-none focus:border-primary-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-body-large font-medium text-secondary-900 mb-2">
                                End Time (M:SS) - Max 3:00
                            </label>
                            <input
                                type="text"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                placeholder="3:00"
                                className="w-full px-4 py-3 rounded-lg border border-secondary-300 focus:outline-none focus:border-primary-500"
                                required
                            />
                        </div>
                    </div>

                    {/* Duration Display */}
                    <div className="text-body-base text-secondary-600">
                        Duration: {Math.floor((parseTime(endTime) - parseTime(startTime)) / 60)}:
                        {String((parseTime(endTime) - parseTime(startTime)) % 60).padStart(2, '0')}
                    </div>

                    {/* Transcript */}
                    <div>
                        <label className="block text-body-large font-medium text-secondary-900 mb-2">
                            Transcript (with timestamps)
                        </label>
                        <textarea
                            value={transcript}
                            onChange={(e) => setTranscript(e.target.value)}
                            rows={10}
                            placeholder="0:15 Hello everyone&#10;0:23 Welcome to the show&#10;1:05 Today we're going to..."
                            className="w-full px-4 py-3 rounded-lg border border-secondary-300 focus:outline-none focus:border-primary-500 font-mono text-sm"
                            required
                        />
                    </div>

                    {/* Difficulty */}
                    <div>
                        <label className="block text-body-large font-medium text-secondary-900 mb-2">
                            Difficulty
                        </label>
                        <select
                            value={difficulty}
                            onChange={(e) => setDifficulty(e.target.value as any)}
                            className="w-full px-4 py-3 rounded-lg border border-secondary-300 focus:outline-none focus:border-primary-500"
                        >
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="advanced">Advanced</option>
                        </select>
                    </div>

                    {/* Tags */}
                    <div>
                        <label className="block text-body-large font-medium text-secondary-900 mb-2">
                            Tags (comma-separated)
                        </label>
                        <input
                            type="text"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                            placeholder="cooking, lifestyle, conversation"
                            className="w-full px-4 py-3 rounded-lg border border-secondary-300 focus:outline-none focus:border-primary-500"
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary-500 hover:bg-primary-600 text-surface font-bold py-4 px-6 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Adding...' : 'Add Curated Content'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button
                        onClick={() => router.push('/home')}
                        className="text-primary-500 hover:underline"
                    >
                        ← Back to Home
                    </button>
                </div>
            </div>
        </div>
    );
}
