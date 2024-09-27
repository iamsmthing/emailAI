import express from 'express';
import dotenv from 'dotenv';
import session from 'express-session';
import authRoutes from './routes/authRoutes';
import cors from 'cors';
import './passport';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import axios from 'axios';
dotenv.config();
import http from "http";
import path from 'path';
import { Server } from "socket.io";
import { createClient, LiveTranscriptionEvents } from "@deepgram/sdk";
import { getReplyFromllama } from "./AI controllers/groqWithMemory";



interface DeepGramData{
  type: string;
  channel_index: number[];
  duration: number;
  start: number;
  is_final: boolean;
  speech_final: boolean;
  channel: {
    alternatives: {
      transcript: string;
      confidence: number;
      words: {
        word: string;
        start: number;
        end: number;
        confidence: number;
        punctuated_word: string;
      }[];
    }[];
  };
  metadata: {
    request_id: string;
    model_info: {
      name: string;
      version: string;
      arch: string;
    };
    model_uuid: string;
  };
  from_finalize: boolean;
}



const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', // Frontend origin
    methods: ['GET', 'POST'],
    credentials: true,
  }
});
const deepgramClient = createClient(process.env.DEEPGRAM_API_KEY);
const conversationHistory: Array<{ user: string; bot: string }> = [];
let keepAlive:any;
const PORT = process.env.PORT || 4000;


const setupDeepgram = (socket: any) => {
  const deepgram = deepgramClient.listen.live({
    language: "en",
    // language: 'hi',
    punctuate: true,
    smart_format: true,
    model: 'nova-2',
    endpointing:300,
  });

  if (keepAlive) clearInterval(keepAlive);
  keepAlive = setInterval(() => {
    console.log("deepgram: keepalive");
    deepgram.keepAlive();
  }, 10 * 1000);

  deepgram.addListener(LiveTranscriptionEvents.Open, async () => {
    // console.log("deepgram: connected");

    deepgram.addListener(LiveTranscriptionEvents.Close, async () => {
      // console.log("deepgram: disconnected");
      clearInterval(keepAlive);
      deepgram.finish();
    });

    deepgram.addListener(LiveTranscriptionEvents.Error, async (error: any) => {
      try {
        console.log("deepgram: error received");
        console.error(error);
    
        // Check if `error` has expected structure before accessing properties
        if (error && error.message) {
          console.error('Error message:', error.message);
        }
        
        if (error && error.event && error.event.data) {
          try {
            const data = JSON.parse(error.event.data);
            console.log('Received data:', data);
    
            // Check if the `alternatives` field exists and is accessible
            if (data.alternatives) {
              console.log('Alternatives:', data.alternatives);
            } else {
              console.warn('No alternatives field in the received data.');
            }
          } catch (jsonParseError) {
            console.error('Failed to parse data as JSON:', jsonParseError);
          }
        }
      } catch (e) {
        // Log any other errors
        console.error("An error occurred in Deepgram's error handler:", e);
      }
    });
    
    let partialTranscript = ""; 
    deepgram.addListener(LiveTranscriptionEvents.Transcript, async(data: DeepGramData) => {

      if (data.channel && data.channel.alternatives && data.channel.alternatives.length > 0) {
        const isFinal = data.is_final;
        const speechFinal = data.speech_final;

        const transcript = data.channel.alternatives[0].transcript ?? "";
        
      
        
        socket.emit("transcript", transcript);
        socket.emit("data", data);
        console.log("client:",transcript);
        if(transcript!=""){
          // let data=await getReplyFromllm(transcript);
          // let data=await getReplyFromllama(transcript,conversationHistory);
          // console.log("Reply data:",data.conversationHistory)
          // socket.emit("transcript", data.botResponse);

          if (!isFinal) {
            // Accumulate partial transcripts if speech is not final
            partialTranscript += ` ${transcript}`;
            console.log("Partial transcript:", partialTranscript);
          } else {
            // When speech_final is true, process the full transcript
            const finalTranscript = partialTranscript.trim() || transcript; // Use partial or final transcript
            partialTranscript = ""; // Reset after final transcript is processed
            
            console.log("Final transcript:", finalTranscript);
            socket.emit("transcript", finalTranscript);
    
            // Send to the LLM
            const replyData = await getReplyFromllama(finalTranscript, conversationHistory);
            console.log("Reply data:", replyData.conversationHistory);
            socket.emit("transcript", replyData.botResponse);

            // Generate audio from bot reply and send it over the socket
            // const audioBuffer = await getAudioFromText(replyData.botResponse);
            // console.log("audio buffer:",audioBuffer);
            // socket.emit("audio", audioBuffer); // Send audio buffer over the socket
          }
        }
      }else {
        console.log("No alternatives available in transcript data.");
      }
      
      
    });

    // let data=await getReplyFromllm(actualTranscript);
    // console.log("Reply data:",data)
    // socket.emit("transcript", data);
      

    deepgram.addListener(LiveTranscriptionEvents.Metadata, (data: { channel: { alternatives: { transcript: any; }[]; }; }) => {
      let transcript=data.channel.alternatives[0].transcript;
      if(transcript!=""){

        console.log("client:",transcript);
      }
      socket.emit("metadata", data);
    });
  });

  return deepgram;
};

io.on("connection", (socket:any) => {
  console.log("socket: client connected");
  let deepgram = setupDeepgram(socket);

  socket.on("packet-sent", (data:any) => {
    // console.log("socket: client data received");
    // console.log("Client data");

    if (deepgram.getReadyState() === 1 /* OPEN */) {
      // console.log("socket: data sent to deepgram");
      deepgram.send(data);
    } else if (deepgram.getReadyState() >= 2 /* 2 = CLOSING, 3 = CLOSED */) {
      
      deepgram.finish();
      deepgram.removeAllListeners();
      deepgram = setupDeepgram(socket);
    } else {
      console.log("socket: data couldn't be sent to deepgram");
    }
  });

  socket.on("disconnect", () => {
    console.log("socket: client disconnected");
    deepgram.finish();
    deepgram.removeAllListeners();
    deepgram = null!;
  });
});



// Middleware
app.use(cors({
    origin: 'http://localhost:5173', // Frontend URL
    credentials: true
  }));
  app.use(express.json());
  app.use(cookieParser());

  // Session
app.use(session({
    secret: process.env.SESSION_SECRET || 'default_secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false, // Set to true if using HTTPS in production
      httpOnly: true,
    }
  }));

  // Initialize Passport
app.use(passport.initialize());
app.use(passport.session());
// Routes
app.use('/auth', authRoutes);
server.listen(4001, () => {
  console.log(`Web Socket running on port 4001`);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
