import React, { useState, useRef, useEffect } from 'react';

const SpeechRecognition: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const socketRef = useRef<WebSocket | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);

      socketRef.current = new WebSocket('ws://localhost:8000/ws/speech_recognition/');
      socketRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'recognition_result') {
          setTranscript(data.text);
        }
      };

      mediaRecorderRef.current.ondataavailable = async (event) => {
        if (event.data.size > 0 && socketRef.current?.readyState === WebSocket.OPEN) {
            const blob = new Blob([event.data], { type: 'audio/webm' });
            const arrayBuffer = await blob.arrayBuffer();
      
          socketRef.current.send(arrayBuffer);
        }
      };

      mediaRecorderRef.current.start(250);
      setIsListening(true);
    } catch (error) {
      console.error('Error starting speech recognition:', error);
    }
  };

  const stopListening = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    if (socketRef.current) {
      socketRef.current.close();
    }
    setIsListening(false);
  };

  return (
    <div>
      <button onClick={isListening ? stopListening : startListening}>
        {isListening ? 'Stop Listening' : 'Start Listening'}
      </button>
      <p>Transcript: {transcript}</p>
    </div>
  );
};

export default SpeechRecognition;