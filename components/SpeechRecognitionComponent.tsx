import React, { useState, useEffect, useRef } from 'react';

interface Word {
  word: string;
  start: number;
  end: number;
}

interface SpeechRecognitionComponentProps {
  words: Word[];
  currentTime: number;
  onPlayPause: (play: boolean) => void;
}

const SpeechRecognitionComponent: React.FC<SpeechRecognitionComponentProps> = ({ words, currentTime, onPlayPause }) => {
  const [isListening, setIsListening] = useState(false);
  const [score, setScore] = useState(0);
  const [userTranscript, setUserTranscript] = useState('');
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US'; // Set language explicitly


      recognitionRef.current.onresult = (event) => {
        console.log(event.results)
        const current = event.resultIndex;
        const transcriptResult = event.results[current][0].transcript;
        let finalTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript + ' ';
          }
        }
        setUserTranscript(finalTranscript);
        compareTranscripts(finalTranscript);
      };
    } else {
      console.error('Speech recognition not supported');
    }

    recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
        setError(`Speech recognition error: ${event.error}`);
        setIsListening(false);
      };

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const compareTranscripts = (userSpeech: string) => {
    // const currentWords = words.filter(word => 
    //   word.start <= currentTime && word.end >= currentTime
    // );

    const currentWord = words.find(word => word.start >= currentTime)

    const userWords = userSpeech.toLowerCase();
    let newScore = score;
    
    if (currentWord.word.toLowerCase() === userWords) {
    newScore += 1;
    } else {
    newScore = Math.max(0, newScore - 1);
    }

    setScore(newScore);
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setUserTranscript(''); // Clear the previous speech
      setScore(0); // Reset the score
      onPlayPause(false); // Pause the video

    } else {
      setUserTranscript(''); // Also clear speech when starting
      setScore(0); // Reset the score when starting
      setError(null);
    //   onPlayPause(true); // Start the video
      recognitionRef.current?.start();
    }
    setIsListening(!isListening);
  };

  return (
    <div className="mt-4">
      <button
        onClick={toggleListening}
        className={`px-4 py-2 rounded ${
          isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
        } text-white font-bold transition duration-300 ease-in-out`}
      >
        {isListening ? 'Stop Listening' : 'Start Listening'}
      </button>
      <p className="mt-2">Score: {score}</p>
      <p className="mt-2">Your speech: {userTranscript}</p>
      {error && <p className="mt-2 text-red-500">{error}</p>}
    </div>
  );
};

export default SpeechRecognitionComponent;