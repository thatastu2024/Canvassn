import { useEffect, useState, useRef } from "react";
import axios from 'axios';
import { faEnvelope,faPlay,faPause,faArrowLeft,faArrowRight,faDownload} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {formatDateTime,formatTime} from '../utils/dateUtil'
import WaveFormAudio from './WaveForm'

const ConversationDetail = ({ isOpen, onClose, conversationDetailsId }) => {
    const [activeTab, setActiveTab] = useState("overview");
    const [conversationDetail,setConversationDetail] = useState({})
    const [audioSrc, setAudioSrc] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);
    useEffect(()=>{
        if(isOpen){
            fetchConversationDetailById(conversationDetailsId)
        }
    },[isOpen])

    const fetchConversationDetailById = async (id) =>{
      try{
        let token=localStorage.getItem('token')
        const response=await axios.get('/api/bot/show/'+id,{
            headers:{
                Authorization:'Bearer '+token,
                "Content-Type": "application/json",
            }
        })
        setConversationDetail(response?.data?.data)
        if(response){
          fetchRecording(response?.data?.data?.conversation_id)
        }
      }catch(error){
        console.log(error)
      }
    }
    const fetchRecording = async(id) =>{
      try{
        const response=await axios.get(process.env.NEXT_PUBLIC_ELEVEN_LABS_API_BASEURL+'/conversations/'+id+'/audio',{
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


  const togglePlayPause = () => {
    if (audioRef.current.paused) {
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const seekBackward = () => {
    audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 5);
  };

  const seekForward = () => {
    audioRef.current.currentTime = Math.min(audioRef.current.duration, audioRef.current.currentTime + 5);
  };

  const downloadAudio = () => {
    const link = document.createElement("a");
    link.href = audioSrc;
    link.download = "call_recording.mp3";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return (
    <div
      className={`fixed top-0 right-0 h-full w-[75%] bg-white shadow-lg transform transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="p-4 flex justify-between items-center border-b">
        <h2 className="text-xl font-semibold">Conversation with  {conversationDetail?.agent_name}</h2>
        <button className="text-red-500 text-lg" onClick={onClose}>
          ✖
        </button>
      </div>
      <div className="p-4 grid grid-rows-[30%_70%] gap-4 h-[calc(100%-60px)]">
        <div className="bg-white p-4 border-b w-full h-full grid grid-cols-[20%_80%] items-center gap-4">
            <div className="flex justify-center">
                <img
                src="/Men.webp"
                alt="Profile"
                className="w-20 h-21 rounded-full object-cover"
                />
            </div>
            <div className="space-y-1">
            <div className="text-lg font-semibold">{conversationDetail?.prospectData?.prospect_name}</div>
            <div className="text-gray-600"><FontAwesomeIcon icon={faEnvelope}/> {conversationDetail?.prospectData?.prospect_email}</div>
            <div className="text-gray-600">📍 {conversationDetail?.prospectData?.prospect_location}</div>
          </div>
        </div>
        <div className="bg-white w-full flex flex-col">
            <div className="flex border-b">
                {["overview", "messages", "recording", "meta_data"].map(
                (tab) => (
                    <button
                    key={tab}
                    className={`p-3 flex-1 text-center capitalize ${
                        activeTab === tab
                        ? "border-b-2 border-blue-500 font-semibold"
                        : "text-gray-600"
                    }`}
                    onClick={() => setActiveTab(tab)}
                    >
                    {tab.replace("_", " ")}
                    </button>
                )
                )}
            </div>
            <div className="p-4 flex-grow overflow-auto">
                {activeTab === "overview" && (
                  <div className="grid grid-rows-4 gap-4 ">
                    <div className="bg-white-100 p-4 rounded-lg shadow">
                      <h3 className="text-lg font-semibold">Summary</h3>
                      <p>{conversationDetail?.analysis?.transcript_summary}</p>
                    </div>
                </div>
                )}
                {activeTab === "messages" && (
                  <div className="p-4 h-[400px] overflow-y-auto bg-white-100 rounded-lg">
                    <h2 className="text-lg font-bold mb-2">Chat</h2>
                    <div className="flex flex-col space-y-3">
                      {conversationDetail.transcript.map((msg, index) => (
                        <div key={index} className={`flex items-start w-full ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                          {msg.role === "user" && msg.message !== null && (
                            <div className="flex items-center space-x-2">
                              <div className="bg-blue-500 text-white p-3 rounded-lg max-w-[75%]">
                                {msg.message}
                              </div>
                              <img src='/Men.webp' alt="User" className="w-8 h-8 rounded-full" />
                            </div>
                          )}
                          {msg.role === "agent" && msg.message !== null && (
                            <div className="flex items-center space-x-2">
                              <img src='/Men.webp' alt="AI" className="w-8 h-8 rounded-full" />
                              <div className="bg-gray-300 text-black p-3 rounded-lg max-w-[75%]">
                                {msg.message}
                              </div>
                            </div>
                          )}
                      </div>
                      ))}
                    </div>
                  </div>
                )}
                {activeTab === "recording" && (
                  <div className="p-4 bg-white rounded-lg shadow-md">
                  <h2 className="text-lg font-bold mb-3">Call Recording</h2>
            
                  {audioSrc ? (
                    <WaveFormAudio historyId={conversationDetail.conversation_id}/>
                  ) : (
                    <p>Loading recording...</p>
                  )}
                </div>
                )}
                {activeTab === "meta_data" && (
                  <div className="p-4 bg-white rounded-lg shadow-md">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="p-3 border rounded-lg text-center">
                        <h3 className="font-semibold text-gray-600">Date</h3>
                        <p className="text-lg font-bold">{formatDateTime(conversationDetail?.createdAt)}</p>
                      </div>
              
                      <div className="p-3 border rounded-lg text-center">
                        <h3 className="font-semibold text-gray-600">Duration</h3>
                        <p className="text-lg font-bold">{formatTime(conversationDetail?.call_duration_secs)}</p>
                      </div>
              
                      <div className="p-3 border rounded-lg text-center">
                        <h3 className="font-semibold text-gray-600">Used Credits</h3>
                        <p className="text-lg font-bold text-green-500">{conversationDetail?.metadata?.cost}</p>
                      </div>
                    </div>
                  </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationDetail;
