import sys
import traceback
from youtube_transcript_api import YouTubeTranscriptApi

try:
    video_id = sys.argv[1]
    transcript = YouTubeTranscriptApi.get_transcript(video_id)
    text = " ".join([entry['text'] for entry in transcript])
    print("TRANSCRIPT_START")
    print(text)
    print("TRANSCRIPT_END")
except Exception as e:
    print("Error occurred:")
    traceback.print_exc()
