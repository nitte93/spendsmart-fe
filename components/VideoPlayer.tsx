import React, { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import Transcript from './Transcript';

const VideoSummary = ({ videoUrl, summary, transcriptSegments }) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [player, setPlayer] = useState<any>(null);


  const handleProgress = (state) => {
    setCurrentTime(state.playedSeconds);
  };
  const handleReady = (event: { target: any }) => {
    console.log({event}, "ready")
    setPlayer(event.target);
  };
  console.log({player})

  useEffect(() => {
    if (player) {
      const intervalId = setInterval(() => {
        player.getCurrentTime().then((time: number) => {
        //   setCurrentTime(time);
        console.log({time})
        });
      }, 100);

      return () => clearInterval(intervalId);
    }
  }, [player]);

  return (
    <div>
      <ReactPlayer
        url={videoUrl}
        controls
        onProgress={handleProgress}
        onReady={handleReady}
      />
      <h2>Summary</h2>
      <p>{summary}</p>
      <h2>Transcript</h2>
      <Transcript
        transcriptSegments={transcriptSegments}
        currentTime={currentTime}
      />
    </div>
  );
};

export default VideoSummary;