import "dotenv/config";
import cors from "cors";
import express from "express";
import AuthRoute from "./routes/auth.route";
import SitterRoute from "./routes/sitter.route";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:3000", // Frontend local (Next.js)
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
  }),
);

app.get("/", (req, res) => {
  return res.status(200).json("Welcome to Pet Sitter Server");
});

app.get("/health", (req, res) => {
  return res.status(200).json({ status: "OK", timestamp: new Date() });
});

app.use("/auth", AuthRoute);
app.use("/pet-sitter", SitterRoute);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
