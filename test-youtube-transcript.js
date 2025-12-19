const { YoutubeTranscript } = require('youtube-transcript');

async function test() {
    const url = 'https://www.youtube.com/watch?v=iCvmsMzlF7o'; // TED Talk

    try {
        console.log('Fetching transcript for:', url);
        const transcript = await YoutubeTranscript.fetchTranscript(url);
        console.log('✅ Success! Items:', transcript.length);
        console.log('First item:', transcript[0]);

        // Test filtering
        const filtered = transcript.filter(item => {
            const time = item.offset / 1000;
            return time >= 0 && time < 180; // First 3 minutes
        });
        console.log('Filtered (0-3min):', filtered.length);
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error('Full error:', error);
    }
}

test();
