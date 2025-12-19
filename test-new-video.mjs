
import { Innertube } from 'youtubei.js';
import fs from 'fs';
import path from 'path';

// Simple .env parser
function loadEnv() {
    try {
        const envPath = path.resolve(process.cwd(), '.env.local');
        if (!fs.existsSync(envPath)) return {};
        const content = fs.readFileSync(envPath, 'utf8');
        const env = {};
        content.split('\n').forEach(line => {
            const match = line.match(/^([^=]+)=(.*)$/);
            if (match) {
                const key = match[1].trim();
                const value = match[2].trim();
                env[key] = value;
            }
        });
        return env;
    } catch (e) {
        return {};
    }
}

async function test() {
    const env = loadEnv();
    const cookies = env.YOUTUBE_COOKIES;
    const videoId = 'fIaB88pgfg0'; // New test video

    console.log('🍪 Loaded Cookie length:', cookies ? cookies.length : 0);
    console.log('🎥 Testing new video:', videoId);

    try {
        const youtube = await Innertube.create({
            cookie: cookies
        });

        const info = await youtube.getInfo(videoId);
        console.log('✅ Video info fetched successfully');
        console.log('   Title:', info.basic_info.title);

        const transcriptData = await info.getTranscript();

        if (transcriptData?.transcript?.content?.body?.initial_segments) {
            const segments = transcriptData.transcript.content.body.initial_segments;
            console.log('✅ Transcript found! Segments:', segments.length);
            console.log('   First segment:', segments[0].snippet.text);
        } else {
            console.log('❌ No transcript segments found in response structure.');
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.info) console.error('   Error info:', error.info);
    }
}

test();
