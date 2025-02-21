import React, { useState } from 'react';

const VideoMerger = () => {
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const [rl,setRl] = useState(null)
  const mergeVideos = async () => {
    const formData = new FormData();
    formData.append('videos', file1);
    formData.append('videos', file2);

    const response = await fetch('http://localhost:5000/merge', {
      method: 'POST',
      body: formData,
    });

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    setRl(url)
    const link = document.createElement('a');
    link.href = url;
    link.download = 'merged_video.mp4';
    link.click();
  };

  return (
    <div>
      <h1>Merge Videos</h1>
      <input type="file" accept="video/mp4" onChange={(e) => setFile1(e.target.files[0])} />
      <input type="file" accept="video/mp4" onChange={(e) => setFile2(e.target.files[0])} />
      <button onClick={mergeVideos}>Merge Videos</button>
      {
        rl && <video  autoPlay mute src={rl} />
      }
    </div>
  );
};

export default VideoMerger;
