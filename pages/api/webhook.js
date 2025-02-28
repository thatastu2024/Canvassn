export default async function handler(req, res) {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method Not Allowed" });
    }
    console.log("Received Webhook Data:", req.body);
  
    // Respond to webhook
    res.status(200).json({ message: "Webhook received successfully" });
  }
