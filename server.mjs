
import express from "express";
import OpenAI from "openai";

const app = express();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.use(express.json({ limit: "1mb" }));
app.use(express.static("public"));

app.post("/api/chat", async (req, res) => {
  try {
    const messages = req.body.messages;

    if (!Array.isArray(messages) || messages.length === 0 || messages.length > 20) {
      return res.status(400).json({ error: "Invalid conversation." });
    }

    const safeMessages = messages.map(m => ({
      role: m.role === "assistant" ? "assistant" : "user",
      content: String(m.content || "").slice(0, 8000)
    }));

    const response = await openai.responses.create({
      model: "gpt-5.5",
      instructions: `You are ShamahGPT, a helpful, intelligent,
friendly AI assistant. Answer clearly, accurately, and naturally.
You can help with research, writing, coding, education, and creativity.`,
      tools: [{ type: "web_search" }],
      input: safeMessages
    });

    res.json({ reply: response.output_text });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "ShamahGPT encountered an error. Please try again."
    });
  }
});

app.listen(process.env.PORT || 3000, "0.0.0.0", () => {
  console.log("ShamahGPT is running!");
});
