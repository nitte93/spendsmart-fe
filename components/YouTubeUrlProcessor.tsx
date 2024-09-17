import { useState, useCallback } from 'react';
import SpeechRecognitionVosk from '@/components/SpeechRecognitionVosk';
// import VideoPlayer from '@/components/VideoPlayer';
import VideoPlayerNew from '@/components/VideoPlayerNew';
import SpeechToText from '@/components/STT';

export default function YouTubeUrlProcessor() {
  const [url, setUrl] = useState('');
  const [response, setResponse] = useState('');
  const [summary, setSummary] = useState('');
  const [transcriptSegments, setTranscriptSegments] = useState([]);

  const handleSubmit = useCallback(async (e: React.FormEvent | string) => {
    if (typeof e === 'string') {
      setUrl(e);
    } else {
      e.preventDefault();
    }
    try {
      const res = await fetch('http://localhost:8000/api/summarize/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: typeof e === 'string' ? e : url }),
      });
      const data = await res.json();
      console.log({data})
      setResponse(JSON.stringify(data, null, 2));
      setSummary(data.summary);
      setTranscriptSegments(data.transcript);

    } catch (error) {
      console.error('Error:', error);
      setResponse('Error processing URL');
    }
  }, [url]);

  const handleSetPredefinedUrl = () => {
    const predefinedUrl = 'https://www.youtube.com/watch?v=uvX4k_3Cmvs';
    setUrl(predefinedUrl);
    handleSubmit(predefinedUrl);
  };

  console.log({url, summary})
  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">YouTube URL Processor</h2>
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter YouTube URL"
          required
          className="w-full p-2 border border-gray-300 rounded-md mb-2"
        />
        <div className="flex space-x-2">
          <button 
            type="submit" 
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
          >
            Process
          </button>
          <button 
            type="button"
            onClick={handleSetPredefinedUrl}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
          >
            Set Predefined URL
          </button>
        </div>
      </form>
      <div className="flex flex-col items-center justify-center">
        Not seeing this
        <h1>Real-time Speech-to-Text</h1>
        <SpeechToText />
      </div>
      {/* <SpeechRecognitionVosk /> */}

      {url && summary && (
        <div>
          <h3 className="text-xl font-semibold mb-2">Summary:</h3>
          <VideoPlayerNew videoUrl={url} transcript={transcriptSegments[0]}/>
        </div>
      )}
    </div>
  );
}