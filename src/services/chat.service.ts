import ChatbotClient from "./chatbot/client";

const ChatService = {
  askChatbot: async (query: string, topK: number) => {
    return ChatbotClient.askChatbot(query, topK);
  },
};

export default ChatService;
