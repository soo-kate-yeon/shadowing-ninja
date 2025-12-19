
import { Innertube } from 'youtubei.js';

async function test() {
    try {
        const videoId = 'iCvmsMzlF7o'; // TED Talk
        console.log('Fetching via Innertube for (default):', videoId);

        try {
            const youtube = await Innertube.create({
                lang: 'en',
                location: 'US',
                retrieve_player: false // Try without player JS
            });
            const info = await youtube.getInfo(videoId);
            const transcriptData = await info.getTranscript();

            if (transcriptData?.transcript?.content?.body?.initial_segments) {
                console.log('Success with config!');
                console.log('Count:', transcriptData.transcript.content.body.initial_segments.length);
            } else {
                console.log('No data with config');
            }
        } catch (e) {
            console.error('Config fetch error:', e.message);
        }

    } catch (error) {
        console.error('Error:', error);
    }
}

test();
