import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchScriptAsync, selectGeneratedScript, selectScriptstatus } from "./startSlice";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Speech from "speak-tts";

const GenerateScript = () => {
  const dispatch = useDispatch();
  const isLoading = useSelector(selectScriptstatus); // Expected to be "loading" when generating
  const generatedScript = useSelector(selectGeneratedScript);
  const [speechOutput, setSpeechOutput] = useState("");
  const [textToSpeechInput, setTextToSpeechInput] = useState(""); // State for TTS input
  const [selectedVideos, setSelectedVideos] = useState({}); // Selected video index
  const [mergedVideoUrl, setMergedVideoUrl] = useState(null); // For displaying merged video URL
  const [vidText, setVidText] = useState(null); // Input text for finding videos
  const [vidData, setVidData] = useState([]); // For storing fetched videos
  const [uploadedVideos, setUploadedVideos] = useState([]); // For storing user-uploaded videos
  const [search, setSearch] = useState(""); // For the script generation search prompt
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [speech, setSpeech] = useState(null);

  // Initialize speak-tts library
  useEffect(() => {
    const speechInstance = new Speech();
    speechInstance
      .init({
        volume: 1,
        lang: "en-US",
        rate: 1,
        pitch: 1,
        splitSentences: true,
      })
      .then((data) => {
        console.log("Speech is ready", data);
        setSpeech(speechInstance);
      })
      .catch((e) => {
        console.error("Speech initialization error:", e);
        toast.error("Speech synthesis initialization failed", {
          position: "top-right",
          autoClose: 2000,
        });
      });
  }, []);

  const handleGenerateScript = () => {
    dispatch(fetchScriptAsync({ prompt: search }));
  };

  // Updated text-to-speech handler using speak-tts
  const handleTextToSpeech = () => {
    if (!textToSpeechInput.trim()) {
      toast.error("Please enter text to convert", { position: "top-right", autoClose: 2000 });
      return;
    }
    if (speech) {
      speech
        .speak({
          text: textToSpeechInput,
        })
        .then(() => {
          console.log("Text has been spoken");
        })
        .catch((e) => {
          console.error("Speech synthesis error:", e);
          toast.error("Text-to-speech error", { position: "top-right", autoClose: 2000 });
        });
    } else {
      toast.error("Speech synthesis not initialized", { position: "top-right", autoClose: 2000 });
    }
  };

  const handleFindVideos = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/search?query=${vidText}`);
      setVidData(response.data.videos);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDownloadVideo = (videoUrl, filename) => {
    const link = document.createElement("a");
    link.href = videoUrl;
    link.download = filename;
    link.click();
  };

  const handleCheckboxChange = (index) => {
    setSelectedVideos((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const videoURL = URL.createObjectURL(file);
      setUploadedVideos((prev) => [...prev, videoURL]);
    }
  };

  const handleIntegrateVideos = () => {
    const videosToMerge = [
      ...Object.keys(selectedVideos)
        .filter((index) => selectedVideos[index])
        .map((index) => vidData[index].video_files[0].link),
      ...uploadedVideos,
    ];
    console.log("Videos to merge:", videosToMerge);
    // Integrate and merge the videos (client-side or backend processing)
  };

  const handleCopyScript = () => {
    const scriptText = generatedScript?.candidates[0]?.content?.parts[0]?.text;
    if (scriptText) {
      navigator.clipboard
        .writeText(scriptText)
        .then(() => {
          toast.success("Script copied to clipboard!", { position: "top-right", autoClose: 2000 });
        })
        .catch((err) => {
          toast.error("Failed to copy text: " + err, { position: "top-right", autoClose: 2000 });
        });
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

      {/* Navbar Section */}
      <nav className="fixed top-0 left-0 w-full bg-gray-900 text-white shadow-lg z-50">
        <div className="container mx-auto flex justify-between items-center px-6 py-4">
          <div className="text-3xl font-bold text-yellow-400">CK</div>
          {/* Hamburger Icon for Mobile */}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden text-yellow-400 focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
          {/* Navigation Links */}
          <div className={`lg:flex lg:space-x-8 text-lg font-medium absolute lg:static top-16 left-0 w-full lg:w-auto bg-gray-900 lg:bg-transparent transition-all transform ${isMenuOpen ? "block" : "hidden"}`}>
            <a href="/" className="block lg:inline-block py-2 px-4 lg:py-0 hover:text-yellow-400 transition-all duration-300">Home</a>
            <a href="/generate-script" className="block lg:inline-block py-2 px-4 lg:py-0 hover:text-yellow-400 transition-all duration-300">Generate Script</a>
            <a href="/features" className="block lg:inline-block py-2 px-4 lg:py-0 hover:text-yellow-400 transition-all duration-300">Features</a>
            <a href="/contact" className="block lg:inline-block py-2 px-4 lg:py-0 hover:text-yellow-400 transition-all duration-300">Contact</a>
          </div>
        </div>
      </nav>

      {/* Content Section */}
      <div className="pt-20 px-8 flex flex-col items-center justify-center">
        <div className="container mx-auto flex flex-col lg:flex-row items-center gap-12">
          {/* Left Image */}
          <div className="w-full lg:w-1/2">
            <img src="https://cdn-icons-png.flaticon.com/512/3131/3131621.png" alt="Script Writing" className="w-full rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300" style={{ width: "60%" }} />
          </div>
          {/* Right Content */}
          <div className="w-full lg:w-1/2 flex flex-col items-center text-center lg:items-start lg:text-left">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6 animate-slideInUp">Generate Your Script Instantly</h1>
            <p className="text-lg text-gray-400 mb-8 animate-fadeIn">Enter your topic below, and our AI will create a script for you in seconds.</p>
            <div className="w-full flex flex-col gap-4 animate-fadeIn delay-200">
              <input type="text" onChange={(e) => setSearch(e.target.value)} placeholder="Enter topic for your script" className="w-full px-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-yellow-400 focus:outline-none" />
              <button onClick={handleGenerateScript} className="bg-yellow-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-yellow-600 transform hover:scale-105 transition-transform duration-300">
                Generate Script
              </button>
            </div>
            <div className="w-full mt-6 p-4 bg-gray-800 rounded-lg shadow-lg animate-fadeIn">
              <h2 className="text-xl font-semibold mb-3 text-yellow-400">Output</h2>
              <div className="w-full h-40 overflow-y-auto p-3 bg-gray-700 rounded-lg text-gray-300 whitespace-pre-line flex items-center justify-center">
                {isLoading === "loading" ? (
                  <div className="loader" />
                ) : (
                  generatedScript?.candidates[0]?.content?.parts[0]?.text || "Your script will appear here once generated."
                )}
              </div>
              {generatedScript?.candidates[0]?.content?.parts[0]?.text && (
                <button onClick={handleCopyScript} className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600 transform hover:scale-105 transition-transform duration-300">
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
            <img src="https://cdn-icons-png.flaticon.com/512/8984/8984813.png" alt="Text-to-Speech" className="w-full rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300" style={{ width: "80%" }} />
          </div>
          {/* Right Content */}
          <div className="w-full lg:w-1/2 flex flex-col items-center text-center lg:items-start lg:text-left">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6 animate-slideInUp">Convert Text to Speech</h1>
            <p className="text-lg text-gray-400 mb-8 animate-fadeIn">Paste your text below, and our AI will convert it into lifelike speech.</p>
            <div className="w-full flex flex-col gap-4 animate-fadeIn delay-200">
              <textarea rows="4" value={textToSpeechInput} onChange={(e) => setTextToSpeechInput(e.target.value)} placeholder="Enter text to convert to speech" className="w-full px-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-yellow-400 focus:outline-none"></textarea>
              <button onClick={handleTextToSpeech} className="bg-yellow-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-yellow-600 transform hover:scale-105 transition-transform duration-300">
                Convert to Speech
              </button>
            </div>
            <div className="w-full mt-6 p-4 bg-gray-800 rounded-lg shadow-lg animate-fadeIn">
              <h2 className="text-xl font-semibold mb-3 text-yellow-400">Output</h2>
              <div className="w-full h-40 overflow-y-auto p-3 bg-gray-700 rounded-lg text-gray-300 whitespace-pre-line">
                {speechOutput || "Speech output will appear here."}
              </div>
            </div>
          </div>
        </div>
        <div className="w-full h-px bg-gray-700 my-12"></div>
        {/* Video Suggestions Section */}
        <div className="container mx-auto">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6 animate-slideInUp text-center">Relevant Videos for Your Script</h1>
          <p className="text-lg text-gray-400 mb-8 animate-fadeIn text-center">Discover videos tailored to each sentence in your script.</p>
          <div className="w-full flex flex-col gap-4 mb-6">
            <input type="text" value={vidText} onChange={(e) => setVidText(e.target.value)} placeholder="Enter your script here" className="w-full px-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-yellow-400 focus:outline-none" />
          </div>
          <div className="mb-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {vidData.map((vid, index) => (
                <div key={index} className="bg-gray-800 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300">
                  <video src={vid.video_files[0].link} autoPlay loop muted alt={`Video suggestion ${index + 1}`} className="w-full h-40 object-cover rounded-t-lg" />
                  <div className="p-4 text-center">
                    <button onClick={() => handleDownloadVideo(vid.video_files[0].link, `video_${index + 1}.mp4`)} className="mt-3 bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-yellow-600 transform hover:scale-105 transition-transform duration-300">
                      Download Video
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button onClick={handleFindVideos} className="bg-yellow-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-yellow-600 transform hover:scale-105 transition-transform duration-300">
            Find Videos
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default GenerateScript;
