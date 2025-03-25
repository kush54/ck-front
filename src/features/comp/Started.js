// forget transition i want that i can select video from my device as well

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchScriptAsync,
  selectGeneratedScript,
  selectScriptstatus,
} from "./startSlice";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const GenerateScript = () => {
  const dispatch = useDispatch();
  const isLoading = useSelector(selectScriptstatus); // Expected to be "loading" when generating
  const generatedScript = useSelector(selectGeneratedScript);
  const [selectedVideos, setSelectedVideos] = useState([]);
  const [mergedVideoUrl, setMergedVideoUrl] = useState(null); // For displaying merged video URL
  const [vidText, setVidText] = useState(null); // Input text for finding videos
  const [vidData, setVidData] = useState([]); // For storing fetched videos
  // const [uploadedVideos, setUploadedVideos] = useState([]);
  // // For storing user-uploaded videos
  const [search, setSearch] = useState(""); // For the script generation search prompt
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // In your frontend

  const handleGenerateScript = () => {
    dispatch(fetchScriptAsync({ prompt: search }));
  };

  const handleFindVideos = async () => {
    try {
      const response = await axios.get(
        `/api/search?query=${vidText}`
      );
      setVidData(response.data.videos);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCopyScript = () => {
    const scriptText = generatedScript?.candidates[0]?.content?.parts[0]?.text;
    if (scriptText) {
      navigator.clipboard
        .writeText(scriptText)
        .then(() => {
          toast.success("Script copied to clipboard!", {
            position: "top-right",
            autoClose: 2000,
          });
        })
        .catch((err) => {
          toast.error("Failed to copy text: " + err, {
            position: "top-right",
            autoClose: 2000,
          });
        });
    }
  };

  const [textToSpeechInput, setTextToSpeechInput] = useState();
  const [audioUrl, setAudioUrl] = useState("");
  const [audioLoader, setAudioLoader] = useState(false);

  const handleTextToSpeech = async (e) => {
    console.log(textToSpeechInput, "chala");
    if (!textToSpeechInput) {
      toast.error("Please generate text first");
      return;
    }

    setAudioLoader(true);

    try {
      const response = await axios.post(
        "/generate-audio",
        {
          text: textToSpeechInput,
        },
        {
          responseType: "arraybuffer",
        }
      );

      // Create audio URL from binary data
      const audioBlob = new Blob([response.data], { type: "audio/mpeg" });
      const url = URL.createObjectURL(audioBlob);

      setAudioUrl(url);
      toast.success("Audio generated successfully!");
    } catch (error) {
      toast.error(error.response?.data?.error || "Audio generation failed");
    } finally {
      setAudioLoader(false);
    }
  };

  const speechOutput = "";

  const [loading, setLoading] = useState(false);

  const [isMerging, setIsMerging] = useState(false);

  // const handleIntegrateVideos = async () => {
  //   setIsMerging(true);

  //   if (selectedVideos.length === 0) return alert("No videos selected");

  //   try {
  //     const videosToMerge = selectedVideos.map((video) => ({
  //       url: video.url, // Use direct URL from Pexels/user upload
  //       startTime: video.startTime,
  //       endTime: video.endTime,
  //     }));

  //     const response = await fetch("http://localhost:5000/merge", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ videos: videosToMerge }),
  //     });

  //     const data = await response.json();
  //     if (data.success) {
  //       setMergedVideoUrl(data.mergedUrl);
  //     }
  //   } catch (error) {
  //     console.error("Merge Error:", error);
  //   }
  //   setIsMerging(false);
  // };

  const handleIntegrateVideos = async () => {
    setIsMerging(true);

    const formData = new FormData();

    // Add metadata with type information
    const videoMetadata = selectedVideos.map((video) => ({
      type: video.file ? "uploaded" : "external",
      startTime: video.startTime,
      endTime: video.endTime,
      url: video.url,
    }));

    formData.append("videos", JSON.stringify(videoMetadata));

    // Add only uploaded files
    selectedVideos.forEach((video) => {
      if (video.file) {
        formData.append("videos", video.file, video.file.name);
      }
    });

    try {
      const response = await fetch("/merge", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      // Change this in your video merge success handler
      if (data.success) {
        setMergedVideoUrl(data.mergedUrl);
        setMergedUrl(data.mergedUrl); // Add this line
      }
    } catch (error) {
      console.error("Merge Error:", error);
    }
    setIsMerging(false);
  };

  const handleOrderChange = (index, value) => {
    const updatedVideos = [...selectedVideos];
    updatedVideos[index].order = value;
    setSelectedVideos(updatedVideos.sort((a, b) => a.order - b.order));
  };

  const handleTimeChange = (index, field, value) => {
    const updatedVideos = [...selectedVideos];
    updatedVideos[index][field] = value;
    setSelectedVideos(updatedVideos);
  };

  const handleFileChange = (event) => {
    console.log(event.target, "idr");
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      const startTime = prompt("Enter start time in seconds:");
      const endTime = prompt("Enter end time in seconds:");

      if (startTime !== null && endTime !== null) {
        setSelectedVideos((prevVideos) => [
          ...prevVideos,
          {
            file,
            startTime: parseFloat(startTime),
            endTime: parseFloat(endTime),
            url,
          },
        ]);
      }
    }
  };

  const [mergedUrl, setMergedUrl] = useState("");
  const [selectedAudio, setSelectedAudio] = useState(null);
  const [finalUrl, setFinalUrl] = useState("");

  const handleAudioUpload = (e) => {
    setSelectedAudio(e.target.files[0]);
  };
  // http://localhost:5000
  // const [mergedVideoUrl, setMergedVideoUrl] = useState(null);

  const handleAudioMerge = async () => {
    if (!mergedVideoUrl || !selectedAudio) return;

    const formData = new FormData();
    formData.append("audio", selectedAudio);
    formData.append("videoUrl", mergedVideoUrl);

    try {
      const response = await fetch("/add-audio", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      if (result.success) {
        setFinalUrl(result.finalUrl);
      }
    } catch (error) {
      console.error("Audio merge failed:", error);
      toast.error("Audio merge failed: " + error.message);
    }
  };


  // recording 
  const [isRecording, setIsRecording] = useState(false);
const [mediaRecorder, setMediaRecorder] = useState(null);
const [recordedAudioUrl, setRecordedAudioUrl] = useState('');

// Add these recording handlers
const startRecording = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    const audioChunks = [];

    recorder.ondataavailable = (e) => {
      audioChunks.push(e.data);
    };

    recorder.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
      const audioUrl = URL.createObjectURL(audioBlob);
      setRecordedAudioUrl(audioUrl);
      stream.getTracks().forEach(track => track.stop());
    };

    recorder.start();
    setMediaRecorder(recorder);
    setIsRecording(true);
  } catch (err) {
    toast.error('Error accessing microphone: ' + err.message);
  }
};

const stopRecording = () => {
  if (mediaRecorder) {
    mediaRecorder.stop();
    setIsRecording(false);
  }
};

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Inline CSS for loader */}
      <style>{`
        .loader {
          border: 8px solid #f3f3f3;
          border-top: 8px solid #3498db;
          border-radius: 50%;
          width: 60px;
          height: 60px;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      <style>{`
  .loader-small {
    border: 3px solid #f3f3f3;
    border-top: 3px solid #3498db;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    animation: spin 1s linear infinite;
    margin-right: 8px;
    display: inline-block;
    vertical-align: middle;
  }
`}</style>

      {/* Navbar Section */}
      <nav className="fixed top-0 left-0 w-full bg-gray-900 text-white shadow-lg z-50">
        <div className="container mx-auto flex justify-between items-center px-6 py-4">
          <div className="text-3xl font-bold text-yellow-400">CK</div>
          {/* Hamburger Icon for Mobile */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden text-yellow-400 focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={
                  isMenuOpen
                    ? "M6 18L18 6M6 6l12 12"
                    : "M4 6h16M4 12h16M4 18h16"
                }
              />
            </svg>
          </button>
          {/* Navigation Links */}
          <div
            className={`lg:flex lg:space-x-8 text-lg font-medium absolute lg:static top-16 left-0 w-full lg:w-auto bg-gray-900 lg:bg-transparent transition-all transform ${
              isMenuOpen ? "block" : "hidden"
            }`}
          >
            <a
              href="/"
              className="block lg:inline-block py-2 px-4 lg:py-0 hover:text-yellow-400 transition-all duration-300"
            >
              Home
            </a>
            <a
              href="/generate-script"
              className="block lg:inline-block py-2 px-4 lg:py-0 hover:text-yellow-400 transition-all duration-300"
            >
              Generate Script
            </a>
            <a
              href="/features"
              className="block lg:inline-block py-2 px-4 lg:py-0 hover:text-yellow-400 transition-all duration-300"
            >
              Features
            </a>
            <a
              href="/contact"
              className="block lg:inline-block py-2 px-4 lg:py-0 hover:text-yellow-400 transition-all duration-300"
            >
              Contact
            </a>
          </div>
        </div>
      </nav>

      {/* Content Section */}
      <div className="pt-20 px-8 flex flex-col items-center justify-center">
        <div className="container mx-auto flex flex-col lg:flex-row items-center gap-12">
          {/* Left Image */}
          <div className="w-full lg:w-1/2">
            <img
              src="https://cdn-icons-png.flaticon.com/512/3131/3131621.png"
              alt="Script Writing"
              className="w-full rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300"
              style={{ width: "60%" }}
            />
          </div>
          {/* Right Content */}
          <div className="w-full lg:w-1/2 flex flex-col items-center text-center lg:items-start lg:text-left">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6 animate-slideInUp">
              Generate Your Script Instantly
            </h1>
            <p className="text-lg text-gray-400 mb-8 animate-fadeIn">
              Enter your topic below, and our AI will create a script for you in
              seconds.
            </p>
            <div className="w-full flex flex-col gap-4 animate-fadeIn delay-200">
              <input
                type="text"
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Enter topic for your script"
                className="w-full px-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
              />
              <button
                onClick={handleGenerateScript}
                className="bg-yellow-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-yellow-600 transform hover:scale-105 transition-transform duration-300"
              >
                Generate Script
              </button>
            </div>
            <div className="w-full mt-6 p-4 bg-gray-800 rounded-lg shadow-lg animate-fadeIn">
              <h2 className="text-xl font-semibold mb-3 text-yellow-400">
                Output
              </h2>
              <div className="w-full h-40 overflow-y-auto p-3 bg-gray-700 rounded-lg text-gray-300 whitespace-pre-line flex items-center justify-center">
                {isLoading === "loading" ? (
                  <div className="loader" />
                ) : (
                  generatedScript?.candidates[0]?.content?.parts[0]?.text ||
                  "Your script will appear here once generated."
                )}
              </div>
              {generatedScript?.candidates[0]?.content?.parts[0]?.text && (
                <button
                  onClick={handleCopyScript}
                  className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600 transform hover:scale-105 transition-transform duration-300"
                >
                  Copy Script
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="w-full h-px bg-gray-700 my-12"></div>
        {/* Text-to-Speech Section */}
        <div className="container mx-auto flex flex-col lg:flex-row items-center gap-12">
          {/* Left Image */}
          <div className="w-full lg:w-1/2">
            <img
              src="https://cdn-icons-png.flaticon.com/512/8984/8984813.png"
              alt="Text-to-Speech"
              className="w-full rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300"
              style={{ width: "80%" }}
            />
          </div>
          {/* Right Content */}
          <div className="w-full lg:w-1/2 flex flex-col items-center text-center lg:items-start lg:text-left">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6 animate-slideInUp">
              Convert Text to Speech
            </h1>
            <p className="text-lg text-gray-400 mb-8 animate-fadeIn">
              Paste your text below, and our AI will convert it into lifelike
              speech.
            </p>
            <div className="w-full flex flex-col gap-4 animate-fadeIn delay-200">
              <textarea
                rows="4"
                value={textToSpeechInput}
                onChange={(e) => setTextToSpeechInput(e.target.value)}
                placeholder="Enter text to convert to speech"
                className="w-full px-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
              ></textarea>
              <button
                onClick={handleTextToSpeech}
                className="bg-yellow-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-yellow-600 transform hover:scale-105 transition-transform duration-300"
              >
                Convert to Speech
              </button>
            </div>
            <div className="w-full mt-6 p-4 bg-gray-800 rounded-lg shadow-lg animate-fadeIn">
              <h2 className="text-xl font-semibold mb-3 text-yellow-400">
                Output
              </h2>
              <div className="w-full h-40 overflow-y-auto p-3 bg-gray-700 rounded-lg text-gray-300 whitespace-pre-line">
                {speechOutput || "Speech output will appear here."}
              </div>
            </div>
          </div>
        </div>
        <div className="w-full h-px bg-gray-700 my-12"></div>
        {/* Video Suggestions Section */}
        <div className="container mx-auto">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6 animate-slideInUp text-center">
            Relevant Videos for Your Script
          </h1>
          <p className="text-lg text-gray-400 mb-8 animate-fadeIn text-center">
            Discover videos tailored to each sentence in your script.
          </p>
          <div className="w-full flex flex-col gap-4 mb-6">
            <input
              type="text"
              value={vidText}
              onChange={(e) => setVidText(e.target.value)}
              placeholder="Enter your script here"
              className="w-full px-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
            />
          </div>
          <div className="mb-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"></div>
          </div>
          <button
            onClick={handleFindVideos}
            className="bg-yellow-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-yellow-600 transform hover:scale-105 transition-transform duration-300"
          >
            Find Videos
          </button>
        </div>
      </div>
      {/* merge code  */}
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-center">Merge Videos</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* In your video selection grid */}
          {vidData.map((vid, index) => (
            <div key={index} className="bg-gray-800 rounded-lg p-4">
              <video
                src={vid.video_files[0]?.link}
                controls
                className="w-full h-40"
              />
              <div className="mt-4">
                <button
                  onClick={() => {
                    const start = prompt("Start time (seconds):");
                    const end = prompt("End time (seconds):");
                    if (start && end) {
                      setSelectedVideos((prev) => [
                        ...prev,
                        {
                          url: vid.video_files[0]?.link,
                          startTime: parseFloat(start),
                          endTime: parseFloat(end),
                        },
                      ]);
                    }
                  }}
                  className="mt-2 bg-green-500 text-white px-3 py-1 rounded"
                >
                  Select Clip
                </button>
              </div>
            </div>
          ))}
        </div>

        {mergedVideoUrl && (
          <div className="mt-6 text-center">
            <h2 className="text-xl font-bold">Merged Video</h2>
            <video
              src={mergedVideoUrl}
              controls
              className="w-full mt-4"
            ></video>
            <a
              href={mergedVideoUrl}
              download="merged_video.mp4"
              className="block mt-2 text-yellow-400 underline"
            >
              Download Merged Video
            </a>
          </div>
        )}
      </div>

      <div className="flex flex-col items-center justify-center p-6 bg-gray-900 shadow-lg rounded-2xl border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Upload Video
        </h2>
        <label className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition">
          Choose File
          <input
            type="file"
            accept="video/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
      </div>

      <div>
        <h2 className="text-lg font-semibold">Selected Videos</h2>
        {selectedVideos.length === 0 ? (
          <p>No videos selected</p>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {selectedVideos.map((video, index) => (
              <li
                key={index}
                className="p-3 border rounded-lg shadow-lg bg-black flex flex-col items-center"
              >
                <video
                  src={video.url}
                  controls
                  className="w-32 h-32 object-cover rounded mb-2"
                ></video>
                <p className="font-semibold text-xs text-center">
                  {video.name} ({video.startTime}s - {video.endTime}s)
                </p>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  <div className="flex flex-col items-center">
                    <label className="text-xs ">Order:</label>
                    <input
                      type="number"
                      value={video.order}
                      onChange={(e) =>
                        handleOrderChange(index, parseInt(e.target.value))
                      }
                      className="border p-1 w-14 text-center rounded text-xs  text-black"
                    />
                  </div>
                  <div className="flex flex-col items-center">
                    <label className="text-xs ">Start:</label>
                    <input
                      type="number"
                      value={video.startTime}
                      onChange={(e) =>
                        handleTimeChange(
                          index,
                          "startTime",
                          parseFloat(e.target.value)
                        )
                      }
                      className="border p-1 w-14 text-center rounded text-xs  text-black"
                    />
                  </div>
                  <div className="flex flex-col items-center">
                    <label className="text-xs ">End:</label>
                    <input
                      type="number"
                      value={video.endTime}
                      onChange={(e) =>
                        handleTimeChange(
                          index,
                          "endTime",
                          parseFloat(e.target.value)
                        )
                      }
                      className="border p-1 w-14 text-center rounded text-xs text-black "
                    />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <button
        onClick={handleIntegrateVideos}
        disabled={isMerging}
        className="mt-6 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-600"
      >
        {isMerging ? "Merging..." : "Merge Videos"}
      </button>

      {/* audio  */}

      <div className="mt-12 container mx-auto p-6 bg-gray-800 rounded-lg">
  {mergedVideoUrl && (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-yellow-400">Add Audio to Video</h3>
      
      {/* Audio Selection Preview */}
      <div className="flex flex-col gap-4">
        {/* File Upload Section */}
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <label className="cursor-pointer bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition w-full sm:w-auto text-center">
            Choose Audio File
            <input
              type="file"
              accept="audio/*"
              onChange={handleAudioUpload}
              className="hidden"
            />
          </label>
          
          {/* Show selected audio file name */}
          {selectedAudio && (
            <div className="text-gray-300">
              <span className="mr-2">Selected audio:</span>
              <span className="text-yellow-400">{selectedAudio.name}</span>
            </div>
          )}
        </div>

        {/* Microphone Recording Section */}
        <div className="mt-6 space-y-4">
          <h4 className="text-lg font-semibold text-yellow-400">Or Record Audio</h4>
          
          <div className="flex items-center gap-4">
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                isRecording 
                  ? 'bg-red-500 hover:bg-red-600' 
                  : 'bg-blue-500 hover:bg-blue-600'
              } text-white transition-colors`}
            >
              <svg 
                className="w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                {isRecording ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                )}
              </svg>
              {isRecording ? 'Stop Recording' : 'Start Recording'}
            </button>

            {isRecording && (
              <div className="flex items-center text-red-500">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse mr-2"></div>
                Recording...
              </div>
            )}
          </div>

          {recordedAudioUrl && (
            <div className="mt-4 space-y-2">
              <audio controls src={recordedAudioUrl} className="w-full" />
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = recordedAudioUrl;
                    link.download = `recording-${Date.now()}.webm`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                >
                  Download Recording
                </button>
                <button
                  onClick={() => {
                    const file = new File([recordedAudioUrl], `recording-${Date.now()}.webm`, {
                      type: 'audio/webm'
                    });
                    setSelectedAudio(file);
                  }}
                  className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors"
                >
                  Use This Recording
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Audio Preview */}
        {selectedAudio && (
          <div className="mt-4">
            <audio 
              controls 
              src={URL.createObjectURL(selectedAudio)} 
              className="w-full"
            />
          </div>
        )}
      </div>

      <button
        onClick={handleAudioMerge}
        disabled={!selectedAudio || isMerging}
        className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 disabled:opacity-50 transition-colors w-full sm:w-auto"
      >
        {isMerging ? "Merging..." : "Merge Audio"}
      </button>

      {finalUrl && (
        <div className="mt-6 text-center space-y-4">
          <video 
            controls 
            src={finalUrl} 
            className="w-full max-w-2xl mx-auto rounded-lg"
          />
          <a
            href={finalUrl}
            download="final-video.mp4"
            className="inline-block px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            Download Final Video
          </a>
        </div>
      )}
    </div>
  )}
</div>
      <ToastContainer />
    </div>
  );
};

export default GenerateScript;
