import React, { useState, useEffect, useRef } from 'react';

const SPEEDS = {
  SLOW: 30,
  MEDIUM: 50,
  FAST: 70
};

const transcript = "The quick brown fox jumps over the lazy dog. It was the best of times, it was the worst of times. The quick brown fox jumps over the lazy dog. It was the best of times, it was the worst of times. The quick brown fox jumps over the lazy dog. It was the best of times, it was the worst of times. ";

const EnglishTypingGame: React.FC = () => {
  const [speed, setSpeed] = useState(SPEEDS.MEDIUM);
  const [userInput, setUserInput] = useState('');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [avatarPosition, setAvatarPosition] = useState({ x: 0, y: 0 });
  const [isGameStarted, setIsGameStarted] = useState(false);
  const words = transcript.split(' ');
  const inputRef = useRef<HTMLInputElement>(null);
  const [wordPositions, setWordPositions] = useState<{ x: number; y: number }[]>([]);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const [wrongWords, setWrongWords] = useState(0);
  const [jiggleWord, setJiggleWord] = useState(false);
  const [fireIntensity, setFireIntensity] = useState(0);
  const [isFalling, setIsFalling] = useState(false);

  useEffect(() => {
    if (gameAreaRef.current && isGameStarted) {
      const spans = gameAreaRef.current.querySelectorAll('.word-span');
      const positions = Array.from(spans).map(span => {
        const rect = span.getBoundingClientRect();
        const gameAreaRect = gameAreaRef.current!.getBoundingClientRect();
        return {
          x: rect.left - gameAreaRect.left + rect.width / 2,
          y: rect.top - gameAreaRect.top
        };
      });
      setWordPositions(positions);
      if (positions.length > 0) {
        setAvatarPosition({ x: positions[0].x, y: positions[0].y - 30 });
      }
    }
  }, [isGameStarted]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setUserInput(input);

    if (input.endsWith(' ')) {
      const typedWord = input.trim();
      if (typedWord === words[currentWordIndex]) {
        const newIndex = currentWordIndex + 1;
        setCurrentWordIndex(newIndex);
        setUserInput('');
        if (newIndex < words.length) {
          setAvatarPosition({ 
            x: wordPositions[newIndex].x, 
            y: wordPositions[newIndex].y - 30 
          });
        } else {
          setIsGameOver(true);
          alert('Congratulations! You completed the transcript!');
        }
      } else {
        const newWrongWords = wrongWords + 1;
        setWrongWords(newWrongWords);
        setJiggleWord(true);
        setTimeout(() => setJiggleWord(false), 500);
        setFireIntensity(Math.min(newWrongWords * 20, 100));
        
        if (newWrongWords > 5) {
          setIsFalling(true);
          setTimeout(() => {
            setIsGameOver(true);
            alert('Game Over! You fell into the fire pit!');
          }, 1000);
        }
      }
    }
  };

  const handleSpeedChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSpeed(Number(e.target.value));
  };

  const startGame = () => {
    setIsGameStarted(true);
    inputRef.current?.focus();
  };

  const restartGame = () => {
    setCurrentWordIndex(0);
    setUserInput('');
    setIsGameOver(false);
    setIsGameStarted(false);
  };

  return (
    <div className="flex flex-col items-center p-5 font-sans">
      <select 
        onChange={handleSpeedChange} 
        value={speed}
        className="mb-4 p-2 border rounded"
      >
        <option value={SPEEDS.SLOW}>Slow</option>
        <option value={SPEEDS.MEDIUM}>Medium</option>
        <option value={SPEEDS.FAST}>Fast</option>
      </select>
      {!isGameStarted ? (
        <button 
          onClick={startGame}
          className="mt-4 px-4 py-2 text-lg bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
        >
          Start Game
        </button>
      ) : (
        <>
          <div ref={gameAreaRef} className="relative w-full mb-4 p-4 flex justify-center">
            <div 
              className={`absolute transition-all duration-300 ease-in-out ${isFalling ? 'animate-[fall_1s_ease-in-out_forwards]' : ''}`}
              style={{ 
                left: `${avatarPosition.x}px`,
                top: `${avatarPosition.y}px`,
                transform: 'translateX(-50%)', // Center the avatar horizontally
              }}
            >
              🏃
            </div>
            <div className="relative text-center">
              {words.map((word, index) => (
                <span 
                  key={index}
                  className={`word-span ${
                    index < currentWordIndex 
                      ? 'text-green-500' 
                      : index === currentWordIndex 
                        ? 'font-bold underline' 
                        : ''
                  } inline-block mr-2`}
                >
                  {word}
                </span>
              ))}
            </div>
          </div>
          <div className="w-full h-24 relative overflow-hidden">
            <div 
              className="absolute bottom-0 left-0 right-0 transition-all duration-300 ease-in-out"
              style={{ height: `${fireIntensity}%` }}
            >
              {/* Base fire */}
              <div className="absolute bottom-0 left-0 right-0 h-full bg-gradient-to-t from-red-600 via-orange-400 to-yellow-300 animate-[flicker_1.5s_ease-in-out]"></div>
              
              {/* Fire particles */}
              {[...Array(20)].map((_, i) => (
                <div 
                  key={i}
                  className="absolute bottom-0 rounded-full bg-orange-400 animate-[rise_2s_ease-in-out_infinite]"
                  style={{
                    left: `${Math.random() * 100}%`,
                    width: `${Math.random() * 20 + 10}px`,
                    height: `${Math.random() * 20 + 10}px`,
                    animationDelay: `${Math.random() * 2}s`,
                    opacity: Math.random() * 0.7 + 0.3,
                  }}
                ></div>
              ))}
              
              {/* Embers */}
              {[...Array(10)].map((_, i) => (
                <div 
                  key={i}
                  className="absolute bottom-0 rounded-full bg-yellow-200 animate-[float_3s_ease-in-out_infinite]"
                  style={{
                    left: `${Math.random() * 100}%`,
                    width: '2px',
                    height: '2px',
                    animationDelay: `${Math.random() * 3}s`,
                  }}
                ></div>
              ))}
            </div>
          </div>
          <input
            ref={inputRef}
            type="text"
            value={userInput}
            onChange={handleInputChange}
            disabled={isGameOver || isFalling}
            className="w-72 p-2 text-lg border rounded mt-4"
          />
          <div className={`mt-4 text-red-500 ${wrongWords > 0 ? 'animate-[bounce_0.5s_ease-in-out]' : ''}`}>
            Wrong words typed: {wrongWords}
          </div>
          {isGameOver && (
            <button 
              onClick={restartGame}
              className="mt-4 px-4 py-2 text-lg bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Restart
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default EnglishTypingGame;