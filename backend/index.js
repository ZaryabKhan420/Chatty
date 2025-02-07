import cookieParser from "cookie-parser";
import express from "express";
import dotenv from "dotenv";
import { dbConnect } from "./database/dbConnect.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import cors from "cors";
import { app, io, server } from "./lib/socket.js";
import path from "path";

dotenv.config();

const port = process.env.PORT || 5002;
const __dirname = path.resolve();

dbConnect();

app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

const userSocketMap = {};

io.on("connection", (socket) => {
  console.log("User Connected", socket.id);

  const userId = socket.handshake.query.userId;

  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap)); // Broadcast a message to every single connected user

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);

    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export const getReceiverSocketId = (userId) => {
  return userSocketMap[userId];
};

// deploy

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

server.listen(port, () => {
  console.log(`App is listening on PORT: ${port}`);
});
