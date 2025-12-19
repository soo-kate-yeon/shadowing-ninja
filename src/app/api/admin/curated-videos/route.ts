import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { parseTranscriptToSentences } from '@/lib/transcript-parser';

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();

        // Check authentication
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const {
            youtube_url,
            snippet_start_time,
            snippet_end_time,
            transcript_text,
            difficulty,
            tags,
        } = body;

        // Extract video ID from URL
        const videoIdMatch = youtube_url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
        if (!videoIdMatch) {
            return NextResponse.json(
                { error: 'Invalid YouTube URL' },
                { status: 400 }
            );
        }
        const video_id = videoIdMatch[1];

        // Validate snippet duration
        const duration = snippet_end_time - snippet_start_time;
        if (duration > 180) {
            return NextResponse.json(
                { error: 'Snippet duration must be 3 minutes or less' },
                { status: 400 }
            );
        }

        if (duration <= 0) {
            return NextResponse.json(
                { error: 'End time must be after start time' },
                { status: 400 }
            );
        }

        // Parse transcript text with timestamps
        // YouTube transcript can have two formats:
        // Format 1 (same line): "0:15 text here"
        // Format 2 (newline): "8:55\ntext here\n9:01\nmore text"
        const lines = transcript_text.split('\n').map((l: string) => l.trim()).filter((l: string) => l);

        const transcriptItems = [];
        let currentTimestamp: number | null = null;

        for (const line of lines) {
            // Check if this line is a timestamp (M:SS or MM:SS format)
            const timestampMatch = line.match(/^(\d+):(\d+)$/);
            if (timestampMatch) {
                // This is a timestamp line
                const minutes = parseInt(timestampMatch[1]);
                const seconds = parseInt(timestampMatch[2]);
                currentTimestamp = minutes * 60 + seconds;
            } else if (currentTimestamp !== null) {
                // This is text following a timestamp
                transcriptItems.push({
                    text: line,
                    start: currentTimestamp,
                    duration: 2,
                    offset: currentTimestamp,
                    lang: 'en'
                });
                currentTimestamp = null; // Reset for next timestamp
            } else {
                // Try to match inline format: "0:15 text"
                const inlineMatch = line.match(/^(\d+):(\d+)\s+(.+)$/);
                if (inlineMatch) {
                    const minutes = parseInt(inlineMatch[1]);
                    const seconds = parseInt(inlineMatch[2]);
                    const text = inlineMatch[3].trim();
                    const timeInSeconds = minutes * 60 + seconds;

                    transcriptItems.push({
                        text,
                        start: timeInSeconds,
                        duration: 2,
                        offset: timeInSeconds,
                        lang: 'en'
                    });
                }
            }
        }

        if (transcriptItems.length === 0) {
            return NextResponse.json(
                { error: 'No valid timestamped transcript found. Please keep timestamps ON when copying from YouTube.' },
                { status: 400 }
            );
        }

        console.log(`✅ Parsed ${transcriptItems.length} transcript items`);

        const sentences = parseTranscriptToSentences(transcriptItems);

        // Fetch video metadata
        const title = `Video ${video_id}`;
        const thumbnail_url = `https://img.youtube.com/vi/${video_id}/mqdefault.jpg`;
        const channel_name = 'YouTube Channel';
        const attribution = `Content by ${channel_name}`;

        // Insert into database
        const { data, error } = await supabase
            .from('curated_videos')
            .insert({
                video_id,
                title,
                thumbnail_url,
                channel_name,
                snippet_start_time,
                snippet_end_time,
                transcript: sentences,
                difficulty,
                tags,
                source_url: youtube_url,
                attribution,
                created_by: user.id,
            })
            .select()
            .single();

        if (error) {
            console.error('Supabase error:', error);
            return NextResponse.json(
                { error: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            video: data,
        });

    } catch (error) {
        console.error('Admin API error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
