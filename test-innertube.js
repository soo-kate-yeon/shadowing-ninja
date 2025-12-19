
const { Innertube } = require('youtubei.js');

async function test() {
    try {
        const videoId = 'iCvmsMzlF7o'; // TED Talk
        console.log('Fetching via Innertube for:', videoId);

        const youtube = await Innertube.create();
        const info = await youtube.getInfo(videoId);

        try {
            const transcriptData = await info.getTranscript();
            if (transcriptData && transcriptData.transcript) {
                console.log('Success!');
                const segments = transcriptData.transcript.content.body.initial_segments;
                console.log('Segment count:', segments.length);
                if (segments.length > 0) {
                    console.log('First segment:', segments[0]);
                }
            } else {
                console.log('No transcript data structure found.');
            }
        } catch (e) {
            console.error('Inner fetch error:', e.message);
        }

    } catch (error) {
        console.error('Error:', error);
    }
}

test();
