
const { YoutubeTranscript } = require('youtube-transcript');

async function test() {
    try {
        const videoId = 'iCvmsMzlF7o'; // TED Talk
        console.log('Fetching via youtube-transcript for:', videoId);

        // Try with options
        const transcript = await YoutubeTranscript.fetchTranscript(videoId, {
            lang: 'en'
        });

        console.log('Success!');
        console.log('Count:', transcript.length);
        if (transcript.length > 0) {
            console.log('First item:', transcript[0]);
        } else {
            console.log('Transcript is empty.');
        }

    } catch (error) {
        console.error('Error:', error);
    }
}

test();
