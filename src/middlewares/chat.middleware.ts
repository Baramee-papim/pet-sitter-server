import { NextFunction, Request, Response } from "express";
import { AskChatbotBody } from "../types/chat";

const ChatMiddleware = {
  askChatbot: (
    req: Request<{}, {}, Partial<AskChatbotBody>>,
    res: Response,
    next: NextFunction,
  ) => {
    if (!req.body) {
      return res.status(400).json({ error: "Body is required" });
    }

    const { query, topK } = req.body;

    // Check for required fields
    if (!query) {
      return res.status(400).json({ error: "Query is required" });
    }

    // Type validations
    if (typeof query !== "string") {
      return res.status(400).json({ error: "Query must be a string" });
    }

    if (query.trim().length < 10) {
      return res.status(400).json({
        error: "Query must be at least 10 characters long",
      });
    }

    if (topK !== undefined) {
      if (!Number.isInteger(topK) || topK <= 0) {
        return res.status(400).json({
          error: "Top K must be a positive integer",
        });
      }

      if (topK > 10) {
        return res.status(400).json({
          error: "Top K must be less than or equal to 10",
        });
      }
    }

    next();
  },
};

export default ChatMiddleware;
