import React, { useState, useRef, useEffect } from 'react';
import TranscriptNew from './TranscriptNew';
import ReactPlayer from 'react-player';
import SpeechRecognitionComponent from './SpeechRecognitionComponent';
import SpeechRecognitionVosk from './SpeechRecognitionVosk';



interface Word {
  word: string;
  start: number;
  end: number;
}

interface TranscriptSegment {
  text: string;
  words: Word[];
}

interface VideoPlayerProps {
  videoUrl: string;
  transcript: TranscriptSegment;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, transcript }) => {
  const videoRef = useRef<ReactPlayer>(null);
  const transcriptRef = useRef<HTMLDivElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const [player, setPlayer] = useState<any>(null);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);



//   const handleProgress = (state) => {
//     setCurrentTime(state.playedSeconds);
//   };

  const handleReady = () => {
    // console.log({event}, "ready")
    setReady(true);
  };
  console.log({player})

  useEffect(() => {
    // if (ready) {
    //     console.log("ready")   
    //   const intervalId = setInterval(() => {
    //     const time = videoRef.current.getCurrentTime()
    //     console.log({time})
    //     const newTime = transcript.words.find(word => word.start >= time)
    //     console.log({newTime})
    //     // setCurrentTime(transcript.words[0].start);
    //     setCurrentTime(newTime.start);
    //   }, 100);

    //   return () => clearInterval(intervalId);
    // }
  }, [ready]);


//   useEffect(() => {
//     const video = videoRef.current;
//     if (!video) return;

//     const handleTimeUpdate = () => {
//       setCurrentTime(video.currentTime);
//     };

//     video.addEventListener('timeupdate', handleTimeUpdate);

//     return () => {
//       video.removeEventListener('timeupdate', handleTimeUpdate);
//     };
//   }, []);

  console.log({currentTime})
//   useEffect(() => {
//     const words = transcript.flatMap(segment => segment.words);
//     const newIndex = words.findIndex(
//       (word, index) => 
//         currentTime >= word.start && 
//         (index === words.length - 1 || currentTime < words[index + 1].start)
//     );
//     setCurrentWordIndex(newIndex);

//     // Scroll to the current word
//     if (newIndex !== -1 && transcriptRef.current) {
//       const wordElement = transcriptRef.current.querySelector(`[data-word-index="${newIndex}"]`);
//       if (wordElement) {
//         wordElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
//       }
//     }
//   }, [currentTime, transcript]);

const handlePlayPause = (play: boolean) => {
    setPlaying(play);
};

  return (
    <div className="video-player">
      <span>Player</span>
      <ReactPlayer
        ref={videoRef}
        url={videoUrl}
        playing={playing}
        controls={false}
        // onProgress={handleProgress}
        onReady={handleReady}
      />
      <TranscriptNew words={transcript.words} currentTime={currentTime} />
      {/* <SpeechRecognitionComponent words={transcript.words} currentTime={currentTime} 
        onPlayPause={handlePlayPause}/> */}
        <SpeechRecognitionVosk />
    </div>
  );
};

export default VideoPlayer;