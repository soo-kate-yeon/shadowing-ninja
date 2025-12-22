import sys
import json
from youtube_transcript_api import YouTubeTranscriptApi, TranscriptsDisabled, NoTranscriptFound

def get_transcript(video_id):
    try:
        # Instantiate the API
        api = YouTubeTranscriptApi()
        
        # Fetch the transcript (instance method)
        transcript_list = api.fetch(video_id, languages=['en', 'en-US', 'en-GB'])
        
        # Convert to list of dicts for JSON serialization
        # Fully populate fields as defined in TranscriptItem interface
        serialized_transcript = []
        for item in transcript_list:
            serialized_transcript.append({
                "text": item.text,
                "start": item.start,
                "duration": item.duration,
                "offset": item.start, # Use start as offset
                "lang": "en"          # Default to en
            })
        
        # Output as JSON
        print(json.dumps(serialized_transcript))
        
    except (TranscriptsDisabled, NoTranscriptFound):
        print(json.dumps({"error": "No transcript found or transcripts are disabled for this video."}), file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(json.dumps({"error": str(e)}), file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Please provide a video ID."}), file=sys.stderr)
        sys.exit(1)
    
    video_id = sys.argv[1]
    get_transcript(video_id)
