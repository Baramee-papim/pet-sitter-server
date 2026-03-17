import axios from "axios";
import "dotenv/config";
import { AskChatbotResponse } from "../../types/chat";

if (!process.env.CHAT_BOT_SERVICE_URL) {
  console.log("CHAT_BOT_SERVICE_URL is not set in environment variables");
  throw new Error("CHAT_BOT_SERVICE_URL is required");
}

const ChatbotClient = {
  askChatbot: async (query: string, topK?: number) => {
    const response = await axios.post<AskChatbotResponse>(
      `${process.env.CHAT_BOT_SERVICE_URL}/document/query`,
      {
        query,
        top_k: topK,
      },
    );
    return response.data;
  },
};

export default ChatbotClient;
