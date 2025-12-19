
const { YoutubeTranscript } = require('youtube-transcript');
const fs = require('fs');
const path = require('path');

// Load env
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
    const videoId = 'iCvmsMzlF7o'; // TED Talk

    console.log('🍪 Cookies length:', cookies ? cookies.length : 0);

    // HACK: Override global fetch to inject cookies
    const originalFetch = global.fetch;
    global.fetch = async (url, options) => {
        // console.log('Intercepted fetch to:', url);
        const newOptions = {
            ...options,
            headers: {
                ...options?.headers,
                'Cookie': cookies,
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        };
        return originalFetch(url, newOptions);
    };

    try {
        console.log('Fetching via youtube-transcript with cookie hack...');
        const transcript = await YoutubeTranscript.fetchTranscript(videoId);

        console.log('✅ Success!');
        console.log('Count:', transcript.length);
        if (transcript.length > 0) {
            console.log('First item:', transcript[0]);
        }
    } catch (error) {
        console.error('❌ Error:', error);
    }
}

test();
