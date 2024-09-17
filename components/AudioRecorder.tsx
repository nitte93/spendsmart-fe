import { useEffect, useState, useRef } from 'react';
import { AudioContext } from 'standardized-audio-context';
// const MIN_BUFFER_SIZE = 4410; // 0.1 seconds at 44.1kHz

const SAMPLE_RATE = 44100; // 44.1kHz
const MIN_AUDIO_LENGTH = 0.01; // 1 second
const MIN_BUFFER_SIZE = SAMPLE_RATE * MIN_AUDIO_LENGTH; // 44100 samples
let audioBuffer: number[] = []; // Specify the type as number[]


const AudioRecorder = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [feedback, setFeedback] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const chunks = useRef<Blob[]>([]);
  const allChunks = useRef<Blob[]>([]); // New ref to store all chunks

  useEffect(() => {
    let audioSocket: WebSocket;

    const connectWebSocket = () => {
      audioSocket = new WebSocket('ws://localhost:8000/ws/speech1/');
      setSocket(audioSocket);

      audioSocket.onopen = () => console.log('Audio WebSocket connected');
      audioSocket.onerror = (error) => console.error('Audio WebSocket error:', error);
      audioSocket.onclose = (event) => {
        console.log('WebSocket closed. Attempting to reconnect...');
        setTimeout(connectWebSocket, 3000); // Try to reconnect after 3 seconds
      };

      audioSocket.onmessage = (event) => {
        console.log('Audio message:', event.data);
        setFeedback(event.data);
      };
    };

    connectWebSocket();

    return () => {
      if (audioSocket && audioSocket.readyState === WebSocket.OPEN) {
        audioSocket.close();
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = mediaRecorder;
      
      // mediaRecorder.ondataavailable = async (event) => {
      //   if (event.data.size > 0) {
      //     const arrayBuffer = await event.data.arrayBuffer();
      //     const audioContext = new AudioContext({ sampleRate: SAMPLE_RATE });
      //     const decodedBuffer = await audioContext.decodeAudioData(arrayBuffer);
          
      //     const float32Array = decodedBuffer.getChannelData(0);
          
      //     audioBuffer = audioBuffer.concat(Array.from(float32Array));
          
      //     if (audioBuffer.length >= MIN_BUFFER_SIZE) {
      //       if (socket && socket.readyState === WebSocket.OPEN) {
      //         const bufferToSend = new Float32Array(audioBuffer);
      //         socket.send(bufferToSend.buffer);
      //         console.log('Sent buffer of size:', bufferToSend.length);
      //         audioBuffer = [];
      //       } else {
      //         console.log('WebSocket is not open. Cannot send data.');
      //       }
      //     }
      //   }
      // };
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.current.push(event.data);
          allChunks.current.push(event.data); // Store in allChunks as well
          console.log(chunks.current.length, 'chunks.current.length');
          console.log(MIN_BUFFER_SIZE, 'MIN_BUFFER_SIZE');
          // Send chunk if it's large enough
          // if (chunks.current.length  >= MIN_BUFFER_SIZE) { // Adjust this number as needed
            sendAudioChunk();
          // }
        }
      };
      
      mediaRecorder.start(100);
      setIsRecording(true);
      if (socket && socket.readyState === WebSocket.OPEN) {
        // socket.send(JSON.stringify({ type: 'start_chunked_processing' }));
      }

      allChunks.current = []; // Clear allChunks when starting a new recording
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const sendAudioChunk = async () => {
    console.log("trying to send audio chunk");
    if (socket && socket.readyState === WebSocket.OPEN && chunks.current.length > 0) {
      const blob = new Blob(chunks.current, { type: 'audio/mpeg' });
      // const blob = new Blob(audioChunks, { type: 'audio/mpeg' });
      // const arrayBuffer = await blob.arrayBuffer();
      // console.log(arrayBuffer, 'arrayBuffer');
      socket.send(blob);
      chunks.current = []; // Clear the chunks after sending
    }
  };
  const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  const sendAllChunks = async () => {
    console.log("trying to send audio chunk");
    if (socket && socket.readyState === WebSocket.OPEN && allChunks.current.length > 0) {
      const blob = new Blob(allChunks.current, { type: 'audio/webm' });
      const arrayBuffer = await blob.arrayBuffer();
      console.log(arrayBuffer, 'arrayBuffer');
      // const uint8Array = new Uint8Array(arrayBuffer);
      const base64Audio = arrayBufferToBase64(arrayBuffer);


      socket.send(JSON.stringify({
        type: 'full_audio',
        audio_data: base64Audio
      }));
      allChunks.current = []; // Clear the chunks after sending
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      sendAllChunks(); // Send any remaining audio data

      // Create a Blob from all the chunks
      const audioBlob = new Blob(allChunks.current, { type: 'audio/webm' });
      const url = URL.createObjectURL(audioBlob);
      setAudioURL(url);

      mediaRecorderRef.current = null;
    }
    setIsRecording(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Audio Recorder</h2>
        <div className="flex space-x-4 mb-6">
          <button
            onClick={startRecording}
            disabled={isRecording}
            className={`px-4 py-2 rounded-full font-semibold text-white ${
              isRecording ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'
            }`}
          >
            Start Recording
          </button>
          <button
            onClick={stopRecording}
            disabled={!isRecording}
            className={`px-4 py-2 rounded-full font-semibold text-white ${
              !isRecording ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'
            }`}
          >
            Stop Recording
          </button>
        </div>
        {audioURL && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2 text-gray-700">Recorded Audio:</h3>
            <audio controls src={audioURL} className="w-full" />
          </div>
        )}
        
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-2 text-gray-700">Feedback:</h3>
          <p className="text-gray-600">{feedback || 'No feedback yet'}</p>
        </div>
      </div>
    </div>
  );
};

export default AudioRecorder;