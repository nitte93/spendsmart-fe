import React, { useEffect, useRef, useState } from 'react';

const SpeechToText: React.FC = () => {
  const [transcription, setTranscription] = useState<string>('');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const socketRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const workletNodeRef = useRef<AudioWorkletNode | null>(null);

  useEffect(() => {
    const setupAudioContext = async () => {
        audioContextRef.current = new AudioContext();
        await audioContextRef.current.audioWorklet.addModule('stt-audio-processor.js');
      };
    const connectWebSocket = () => {
      socketRef.current = new WebSocket('ws://localhost:8000/ws/speech1/');

      socketRef.current.onopen = () => {
        console.log('WebSocket connection established');
      };

      socketRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log('Received data:', data);
        setTranscription(prev => prev + ' ' + data.text);
      };

      socketRef.current.onclose = (event) => {
        console.log('WebSocket connection closed:', event.reason);
        setTimeout(connectWebSocket, 3000); // Attempt to reconnect after 3 seconds
      };

      socketRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        socketRef.current?.close();
      };
    };

    setupAudioContext();
    connectWebSocket();

    return () => {
      socketRef.current?.close();
      audioContextRef.current?.close();
    };
  }, []);


  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const source = audioContextRef.current!.createMediaStreamSource(stream);
      workletNodeRef.current = new AudioWorkletNode(audioContextRef.current, 'stt-audio-processor');

      workletNodeRef.current.port.onmessage = (event) => {
        const downsampled = event.data;
        console.log('Sending audio data:', downsampled.buffer);
        if (downsampled instanceof Float32Array) {
            const buffer = downsampled.buffer;
            socketRef.current?.send(buffer);
          } else {
            console.error('Unexpected data type from audio worklet:', downsampled);
          }
          };

      source.connect(workletNodeRef.current);
      workletNodeRef.current.connect(audioContextRef.current!.destination);
      setIsRecording(true);
      console.log('Recording started');
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (workletNodeRef.current) {
      workletNodeRef.current.disconnect();
      workletNodeRef.current = null;
      setIsRecording(false);
      console.log('Recording stopped');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-center space-x-4 mb-6">
        <button
          onClick={startRecording}
          disabled={isRecording}
          className={`px-4 py-2 ${isRecording ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'} text-white font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition`}
        >
          Start Recording
        </button>
        <button
          onClick={stopRecording}
          disabled={!isRecording}
          className={`px-4 py-2 ${!isRecording ? 'bg-gray-400' : 'bg-red-500 hover:bg-red-600'} text-white font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition`}
        >
          Stop Recording
        </button>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">Transcription:</h3>
        <p className="bg-gray-100 p-4 rounded-md min-h-[100px] max-h-[200px] overflow-y-auto">
          {transcription}
        </p>
      </div>
    </div>
  );
};

export default SpeechToText;