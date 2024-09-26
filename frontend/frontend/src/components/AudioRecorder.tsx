import { Mic } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import io, { Socket } from 'socket.io-client'

let socket: Socket

const AudioRecorder: React.FC = () => {
  const [isRecording, setIsRecording] = useState<boolean>(false)
  const [transcript, setTranscript] = useState<string>('')
  const microphoneRef = useRef<MediaRecorder | null>(null)
  const captionsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    socketInitializer()
    console.log("inside stt")

    return () => {
      if (socket) {
        socket.disconnect()
      }
    }
  }, [])

  const socketInitializer = async () => {
    try {
      // Ensure the fetch completes and socket connection initializes
    //   const data=await fetch('/api/socket')
    //   console.log(data)
      socket = io('http://localhost:4001',{ transports: ['websocket'] })

      socket.on('connect', () => {
        console.log('client: connected to websocket')
      })

      socket.on('transcript', (newTranscript: string) => {
        if (newTranscript !== '') {
          setTranscript(newTranscript)
          console.log(transcript)
          if (captionsRef.current) {
            captionsRef.current.innerHTML = `<span class="text-white text-lg mb-2 font-bold">${newTranscript}</span>`
          }
        }
      })

      socket.on('disconnect', () => {
        console.log('client: disconnected from websocket')
      })

    } catch (error) {
      console.error('Error initializing socket:', error)
    }
  }

  const getMicrophone = async (): Promise<MediaRecorder> => {
    try {
      const userMedia = await navigator.mediaDevices.getUserMedia({
        audio: true,
      })
      return new MediaRecorder(userMedia)
    } catch (error) {
      console.error('Error accessing microphone:', error)
      throw error // Re-throw to prevent further execution
    }
  }

  const openMicrophone = async (microphone: MediaRecorder) => {
    try {
      microphone.start(500)

      microphone.onstart = () => {
        console.log('client: microphone opened')
        setIsRecording(true)
        document.body.classList.add('recording')
      }

      microphone.onstop = () => {
        console.log('client: microphone closed')
        setIsRecording(false)
        document.body.classList.remove('recording')
      }

      microphone.ondataavailable = (e: BlobEvent) => {
        console.log('client: sent data to websocket')
        if (socket) {
          socket.emit('packet-sent', e.data)
        }
      }
    } catch (error) {
      console.error('Error opening microphone:', error)
    }
  }

  const closeMicrophone = async (microphone: MediaRecorder) => {
    try {
      microphone.stop()
    } catch (error) {
      console.error('Error closing microphone:', error)
    }
  }

  const handleRecordClick = async () => {
    try {
      if (!microphoneRef.current) {
        // If microphone is not started, start it
        microphoneRef.current = await getMicrophone()
        await openMicrophone(microphoneRef.current)
      } else {
        // If microphone is already started, stop it
        await closeMicrophone(microphoneRef.current)
        microphoneRef.current = null
      }
    } catch (error) {
      console.error('Error handling record click:', error)
    }
  }

  return (
    <div className='flex flex-col gap-28 justify-evenly'>
      <div  ref={captionsRef} className="text-center mb-1 px-4 w-[60rem]">
        <p className="text-white text-lg mb-2 font-bold">Transcript: {transcript}</p>
      </div>

      <div className="w-full flex justify-center mb-8">
        <button onClick={handleRecordClick} className="bg-gray-800 rounded-full w-full content-center justify-center flex p-4 text-green-500 hover:bg-gray-600 transition-colors">
          <Mic size={24} />
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </button>
      </div>
    </div>
  )
}

export default AudioRecorder
