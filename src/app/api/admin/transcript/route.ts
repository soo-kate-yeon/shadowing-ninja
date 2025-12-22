import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const url = searchParams.get('url');

    if (!url) {
        return NextResponse.json({ error: 'Missing youtube url' }, { status: 400 });
    }

    // Extract video ID (simple regex, can use the one from lib)
    const videoIdMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    const videoId = videoIdMatch ? videoIdMatch[1] : null;

    if (!videoId) {
        return NextResponse.json({ error: 'Invalid YouTube URL' }, { status: 400 });
    }

    try {
        const scriptPath = path.join(process.cwd(), 'scripts', 'fetch_transcript.py');

        const pythonProcess = spawn('python3', [scriptPath, videoId]);

        let dataString = '';
        let errorString = '';

        return new Promise((resolve) => {
            pythonProcess.stdout.on('data', (data) => {
                dataString += data.toString();
            });

            pythonProcess.stderr.on('data', (data) => {
                errorString += data.toString();
            });

            pythonProcess.on('close', (code) => {
                if (code !== 0) {
                    console.error(`Python script exited with code ${code}`);
                    console.error('Error output:', errorString);
                    resolve(NextResponse.json({ error: errorString || 'Failed to fetch transcript' }, { status: 500 }));
                } else {
                    try {
                        const transcript = JSON.parse(dataString);
                        resolve(NextResponse.json({ transcript }));
                    } catch (e) {
                        console.error('Failed to parse Python output:', dataString);
                        resolve(NextResponse.json({ error: 'Failed to parse transcript data' }, { status: 500 }));
                    }
                }
            });
        });

    } catch (error: any) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
