// pages/api/pusher.js
import Pusher from "pusher";

import authMiddleware from "../../middleware/authMiddleware";

const pusher = new Pusher({
    appId: "1977222",
    key: "49dd9dac8eb95ca3a38a",
    secret: "0559454cc2725ae08fb8",
    cluster: "ap2",
    useTLS: true
});

async function handler(req, res) {
  if (req.method === "POST") {
    const { channel, event, data } = req.body;

    await pusher.trigger(channel, event, data);
    res.status(200).json({ success: true });
  } else {
    res.status(405).end("Method Not Allowed");
  }
}

export default authMiddleware(handler)