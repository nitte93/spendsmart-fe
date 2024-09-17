import React, { useState, useEffect } from 'react';

const Transcript = ({ transcriptSegments, currentTime }) => {
  const [activeSegment, setActiveSegment] = useState(null);

  useEffect(() => {
    const currentSegment = transcriptSegments.find(
      segment => currentTime >= segment.start && currentTime < segment.end
    );
    setActiveSegment(currentSegment);
  }, [currentTime, transcriptSegments]);

  return (
    <div className="transcript">
      {transcriptSegments.map((segment, index) => (
        <p
          key={index}
          className={segment === activeSegment ? 'active' : ''}
        >
          {segment.text}
        </p>
      ))}
    </div>
  );
};

export default Transcript;