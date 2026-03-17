import { Request, Response } from "express";
import AppError from "../errors/AppError";
import ChatService from "../services/chat.service";
import { AskChatbotBody } from "../types/chat";

const ChatController = {
  askChatbot: async (req: Request<{}, {}, AskChatbotBody>, res: Response) => {
    const query = req.body.query;
    const topK = req.body.topK || 5;
    let result;

    try {
      result = await ChatService.askChatbot(query, topK);
    } catch (error) {
      // Client error from service
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message });
      }

      return res.status(500).json({ error: "Internal server error" });
    }

    const answerResponse = {
      query: result.query,
      introduction: result.introduction,
      petSitters: result.sitters,
      confidence: result.confidence,
    };

    return res.status(200).json(answerResponse);
  },
};

export default ChatController;
