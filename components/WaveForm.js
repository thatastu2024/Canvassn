import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import WaveSurfer from "wavesurfer.js";
import { faPlay,faPause,faArrowLeft,faArrowRight,faDownload} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const WaveFormAudio = ({historyId}) => {
  const waveformRef = useRef(null);
  const wavesurfer = useRef(null);
  const [audioSrc, setAudioSrc] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);

  useEffect(() => {
    fetchRecording(historyId);
  }, []);
  const fetchRecording = async(historyId) =>{
    try{
      const response=await axios.get(process.env.NEXT_PUBLIC_ELEVEN_LABS_API_BASEURL+'/conversations/'+historyId+'/audio',{
        headers:{
          'xi-api-key':process.env.NEXT_PUBLIC_ELEVEN_LABS_VALUE,
          "Content-Type": "application/json",
        },
        responseType: "arraybuffer"
      })
      console.log(response.data)
      const audioBlob = new Blob([response?.data]);
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudioSrc(audioUrl);
    }catch(error){
      console.log(error)
    }
  }
  useEffect(() => {
    if (audioSrc && waveformRef.current) {
      wavesurfer.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: "#ddd",
        progressColor: "#4a90e2",
        cursorColor: "#ff0000",
        barWidth: 2,
        responsive: true,
        height: 100,
      });

      wavesurfer.current.load(audioSrc);

      wavesurfer.current.on("ready", () => {
        setTotalDuration(wavesurfer.current.getDuration());
        console.log("Waveform loaded");
      });

      wavesurfer.current.on("audioprocess", () => {
        setCurrentTime(wavesurfer.current.getCurrentTime());
      });

      wavesurfer.current.on("finish", () => {
        setIsPlaying(false);
      });
    }

    return () => wavesurfer.current?.destroy();
  }, [audioSrc]);

  
  const togglePlayPause = () => {
    if (wavesurfer.current) {
      wavesurfer.current.playPause();
      setIsPlaying(!isPlaying);
    }
  };
  
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };
  
  const seekForward = () => {
    if (wavesurfer.current) {
      wavesurfer.current.seekTo(
        Math.min(1, wavesurfer.current.getCurrentTime() / wavesurfer.current.getDuration() + 0.05)
      );
    }
  };

  
  const seekBackward = () => {
    if (wavesurfer.current) {
      wavesurfer.current.seekTo(
        Math.max(0, wavesurfer.current.getCurrentTime() / wavesurfer.current.getDuration() - 0.05)
      );
    }
  };

  
  const downloadAudio = () => {
    if (!audioSrc) return;
    const link = document.createElement("a");
    link.href = audioSrc;
    link.download = "call_recording.mp3";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <div ref={waveformRef} className="w-full bg-white-200 rounded-lg"></div>
      <div className="text-center text-gray-700 font-semibold mb-2">
        {formatTime(currentTime)} / {formatTime(totalDuration)}
      </div>
      <div className="flex justify-center space-x-4 mt-3">
        <button className="bg-gray-500 text-white px-4 py-2 rounded-lg" onClick={seekBackward}>
            <FontAwesomeIcon icon={faArrowLeft}/>
        </button>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg" onClick={togglePlayPause}>
            {isPlaying ? <FontAwesomeIcon icon={faPause}/> : <FontAwesomeIcon icon={faPlay}/>}
        </button>
        <button className="bg-gray-500 text-white px-4 py-2 rounded-lg" onClick={seekForward}>
            <FontAwesomeIcon icon={faArrowRight}/>
        </button>
        <button className="bg-green-500 text-white px-4 py-2 rounded-lg" onClick={downloadAudio}>
            <FontAwesomeIcon icon={faDownload}/>
        </button>
      </div>
    </>
  );
};

export default WaveFormAudio;
