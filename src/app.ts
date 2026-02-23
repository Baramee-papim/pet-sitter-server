import "dotenv/config";
import express from "express";
import authRoute from "./routes/auth.route";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

app.get("/", (req, res) => {
  return res.status(200).json("Welcome to Pet Sitter Server");
});

app.get("/health", (req, res) => {
  return res.status(200).json({ status: "OK", timestamp: new Date() });
});

app.use("/auth", authRoute);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
