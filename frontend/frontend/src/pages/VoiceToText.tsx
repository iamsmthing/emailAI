// import  { useState } from 'react';

import AudioRecorder from '../components/AudioRecorder';


const VoiceToText = () => {
  // const [caption, setCaption] = useState('What are four pieces of information that should be included on a home');

  return (
    <div className="min-h-screen flex flex-col items-center justify-between p-8">
      {/* Status bar */}
      {/* <div className="w-full flex justify-between text-gray-400 text-sm mb-8">
        <span>9:41</span>
        <div className="flex space-x-2">
          <span>􀙇</span>
          <span>􀙨</span>
          <span>􀋦</span>
        </div>
      </div> */}

      {/* Main content */}
      <div className="w-full max-w-xs flex flex-col items-center">
        {/* Animated circles (reverted to previous version) */}
        <div className="relative w-48 h-48 mb-12">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-full border-4 border-green-500 rounded-full animate-pulse"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-40 h-40 border-4 border-green-400 rounded-full animate-ping"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 bg-green-600 rounded-full flex items-center justify-center">
              <div className="w-24 h-24 bg-black rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Caption */}
        {/* <div className="text-center mb-12 px-4 w-[60rem]">
          <p className="text-white text-3xl mb-2 font-bold">{caption}</p>
        </div> */}
      </div>
      <AudioRecorder/>

      {/* Bottom bar with microphone */}
      {/* <div className="w-full flex justify-center mb-8">
        <button className="bg-gray-900 rounded-full p-4 text-green-500 hover:bg-gray-800 transition-colors">
          <Mic size={24} />
        </button>
      </div> */}
    </div>
  );
};

export default VoiceToText;