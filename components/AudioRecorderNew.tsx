import React, { useEffect, useState, useRef } from 'react';

const SAMPLE_RATE = 16000;
const CHUNK_SIZE = 4096; // Adjust as needed

const AudioRecorder: React.FC = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [feedback, setFeedback] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const workletNodeRef = useRef<AudioWorkletNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const connectWebSocket = () => {
      const ws = new WebSocket('ws://localhost:8000/ws/speech1/');
      setSocket(ws);

      ws.onopen = () => console.log('WebSocket connected');
      ws.onerror = (error) => console.error('WebSocket error:', error);
      ws.onclose = () => {
        console.log('WebSocket closed. Attempting to reconnect...');
        setTimeout(connectWebSocket, 3000);
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log('transcription message:', data);
        if (data.type === 'transcription') {
          setFeedback(prevFeedback => prevFeedback + ' ' + data.text);
        }
      };
    };

    connectWebSocket();

    return () => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, []);

  const startRecording = async () => {
    try {

        console.log('Starting recording process...');

        // Check if the browser supports getUserMedia
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('getUserMedia is not supported in this browser');
        }

        console.log('Requesting microphone access...');
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        console.log('Microphone access granted');
        streamRef.current = stream;

        console.log('Creating audio context...');
        audioContextRef.current = new AudioContext({ sampleRate: SAMPLE_RATE });

        // Load and add the audio worklet module
        console.log('Loading audio worklet module...');
        console.log('Loading audio worklet module...');
        try {
          await audioContextRef.current.audioWorklet.addModule('audio-processor.js');
        } catch (workletError) {
          console.error('Error loading audio worklet module:', workletError);
          console.error('Error details:', workletError.message, workletError.stack);
          throw new Error('Failed to load audio processor. Please check the console for more details.');
        }

        console.log('Creating media stream source...');
        const source = audioContextRef.current.createMediaStreamSource(stream);

        console.log('Creating audio worklet node...');
        workletNodeRef.current = new AudioWorkletNode(audioContextRef.current, 'audio-processor');
        workletNodeRef.current.port.onmessage = handleAudioProcess;

        console.log('Connecting source to worklet node...');
        source.connect(workletNodeRef.current);
        workletNodeRef.current.connect(audioContextRef.current.destination);

        console.log('Setting recording state to true...');
        setIsRecording(true);
        setFeedback('');
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ type: 'start_chunked_processing' }));
        }
    } catch (error) {
        console.error('Error accessing microphone:', error);
        let errorMessage = 'An unexpected error occurred. Please try again.';
    
        if (error instanceof DOMException) {
          switch (error.name) {
            case 'NotAllowedError':
              errorMessage = 'Microphone access was denied. Please check your browser settings and try again.';
              break;
            case 'AbortError':
              errorMessage = 'The request to access the microphone was aborted. This might be due to a hardware issue or a browser conflict.';
              break;
            case 'NotFoundError':
              errorMessage = 'No microphone was found. Please check your audio input devices.';
              break;
            case 'NotReadableError':
              errorMessage = 'The microphone is not accessible. It might be in use by another application.';
              break;
            case 'OverconstrainedError':
              errorMessage = 'The requested audio settings are not supported by your device.';
              break;
            default:
              errorMessage = `An error occurred while trying to access the microphone: ${error.name}`;
          }
        } else if (error instanceof Error) {
          errorMessage = error.message;
        }
    
        setFeedback(errorMessage);
    }
  };

  const handleAudioProcess = (event: MessageEvent) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      const audioData = event.data;
      socket.send(audioData.buffer);
    }
  };

  const stopRecording = () => {
    if (workletNodeRef.current) {
      workletNodeRef.current.disconnect();
      workletNodeRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
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
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-2 text-gray-700">Feedback:</h3>
          <p className="text-gray-600">{feedback || 'No feedback yet'}</p>
        </div>
      </div>
    </div>
  );
};

export default AudioRecorder;