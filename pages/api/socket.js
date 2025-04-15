import { Server } from "socket.io";
import axios from "axios";
import ChatHistory from "../../models/ChatHistory";

export default function handler(req, res) {
  if (!res.socket.server.io) {
    console.log("Initializing Socket.io...");
    const io = new Server(res.socket.server, {
      path: "/api/socket",
      addTrailingSlash: false,
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    io.on("connection", (socket) => {
      console.log("User connected:", socket.id);

      socket.on("sendMessage", async (data) => {
        try {
          console.log(data)
          const n8nResponse = await axios.get(
            `https://n8n.canvassn.co.in/webhook/chatbot?query=${encodeURIComponent(data.message)}`
          );
          // await ChatHistory.
          // console.log(getFormattedTimestamp())
          socket.emit("receiveMessage", n8nResponse.data[0].response.text);
        } catch (error) {
          console.error("Error communicating with n8n:", error);
          socket.emit("receiveMessage", { text: "Error processing your request" });
        }
      });

      socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
      });
    });

    res.socket.server.io = io;
  } else {
    console.log("Socket.io already running.");
  }

  res.end();
}

function getFormattedTimestamp() {
  const now = new Date();
  const date = now.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
  const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  return `${date} ${time}`;
}
