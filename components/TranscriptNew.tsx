import React, { useState, useEffect, useRef } from 'react';

interface Word {
  word: string;
  start: number;
  end: number;
}

interface TranscriptProps {
  words: Word[];
  currentTime: number;
}

const Transcript: React.FC<TranscriptProps> = ({ words, currentTime }) => {
  const transcriptRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (transcriptRef.current) {
      // Remove previous highlight
      const previousHighlight = transcriptRef.current.querySelector('.highlight');
      if (previousHighlight) {
        previousHighlight.classList.remove('highlight');
      }

      console.log({currentTime}, currentTime.toFixed(3))
      // Find and highlight the current word
      const currentWord = transcriptRef.current.querySelector(`[data-start="${currentTime.toFixed(3)}"]`);
      console.log({currentWord})
      if (currentWord) {
        currentWord.classList.add('highlight');
        currentWord.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [currentTime]);

  return (
    <div className="transcript" ref={transcriptRef}>
      {words.map((word) => (
        <span
          key={word.start}
          data-start={word.start.toFixed(3)}
          className="word"
        >
          {word.word}{' '}
        </span>
      ))}
    </div>
  );
};

export default Transcript;