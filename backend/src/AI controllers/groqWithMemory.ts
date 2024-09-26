import { ChatGroq } from '@langchain/groq';
import { ConversationChain } from 'langchain/chains';
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate,
  MessagesPlaceholder
} from '@langchain/core/prompts';
import { BufferWindowMemory } from 'langchain/memory';
import { AIMessage, HumanMessage } from "@langchain/core/messages"; // Ensure this import
import dotenv from "dotenv";
dotenv.config();

export async function getReplyFromllama(userQuery: string, conversationHistory: Array<{ user: string; bot: string }>) {
  // Get Groq API key
  const groqApiKey = process.env.GROQ_API_KEY;
  if (!groqApiKey) {
    throw new Error('GROQ_API_KEY not found in environment variables');
  }

  const model = 'llama-3.1-70b-versatile';

  // Initialize Groq Langchain chat object
  const groqChat = new ChatGroq({
    apiKey: groqApiKey,
    model: model,
  });

  const systemPrompt = 'You are a friendly conversational assistant.You have memory that makes you capable of remembering things discussed while conversation.';
  const conversationalMemoryLength = 20;

  // Initialize BufferWindowMemory and populate it with the previous conversation history
  const memory = new BufferWindowMemory({
    k: conversationalMemoryLength,
    returnMessages: true,
    memoryKey: 'chat_history',
  });

  // If there's existing conversation history, add it to the memory
  if (conversationHistory.length > 0) {
    conversationHistory.forEach((entry) => {
      memory.chatHistory.addMessage(new HumanMessage(entry.user)); // Adding user query
      memory.chatHistory.addMessage(new AIMessage(entry.bot));     // Adding bot response
    });
  }

  // Construct a chat prompt template
  const prompt = ChatPromptTemplate.fromPromptMessages([
    SystemMessagePromptTemplate.fromTemplate(systemPrompt),
    new MessagesPlaceholder('chat_history'),
    HumanMessagePromptTemplate.fromTemplate('{human_input}'),
  ]);

  // Create a conversation chain
  const conversation = new ConversationChain({
    llm: groqChat,
    prompt: prompt,
    verbose: false,
    memory: memory,
  });

  // Process the user query
  const response = await conversation.call({ human_input: userQuery });

  // Store the conversation in the history array
  conversationHistory.push({
    user: userQuery,
    bot: response.response,
  });

  return {
    botResponse: response.response,
    conversationHistory: conversationHistory,
  };
}
