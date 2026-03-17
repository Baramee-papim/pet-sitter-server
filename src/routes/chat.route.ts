import { Router } from "express";
import ChatController from "../controllers/chat.controller";
import ChatMiddleware from "../middlewares/chat.middleware";

const ChatRoute = Router();

ChatRoute.post("/ask", [ChatMiddleware.askChatbot], ChatController.askChatbot);

export default ChatRoute;
