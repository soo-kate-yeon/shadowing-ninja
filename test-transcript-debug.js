
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
    const videoId = 'iCvmsMzlF7o';

    console.log('🍪 Cookies length:', cookies ? cookies.length : 0);

    // HACK: Override global fetch to capture response
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
        const response = await originalFetch(url, newOptions);

        // Clone and save
        try {
            const clone = response.clone();
            const text = await clone.text();
            fs.writeFileSync('youtube-debug.html', text);
            console.log('✅ Saved HTML to youtube-debug.html (' + text.length + ' bytes)');
        } catch (e) {
            console.error('Failed to save html', e);
        }

        return response;
    };

    try {
        console.log('Fetching via youtube-transcript with spy...');
        await YoutubeTranscript.fetchTranscript(videoId);
    } catch (error) {
        // console.error('Likely parse error:', error.message);
    }
}

test();
