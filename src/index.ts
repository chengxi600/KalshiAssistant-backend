import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { OpenRouter } from "@openrouter/sdk";
import { SendChatCompletionRequestRequest } from "@openrouter/sdk/esm/models/operations/sendchatcompletionrequest";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/event/:eventTicker", async (req, res) => {
  try {
    const { eventTicker } = req.params;

    if (!eventTicker) {
      return res.status(400).json({ error: "Event ticker is required" });
    }

    const url = `https://api.elections.kalshi.com/trade-api/v2/events/${eventTicker}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorBody = await response.text();
      return res
        .status(response.status)
        .json({ error: "Kalshi API error", details: errorBody });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  } finally {
    return res.end();
  }
});

// POST method route
app.post("/api/stream", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    res.status(400).json({ error: "Message is required" });
    return;
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  const openRouter = new OpenRouter({
    apiKey: process.env["OPENROUTER_API_KEY"] ?? "",
  });

  const request: SendChatCompletionRequestRequest & {
    chatGenerationParams: {
      stream: true;
    };
  } = {
    chatGenerationParams: {
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
      model: "arcee-ai/trinity-large-preview:free",
      temperature: 0.7,
      stream: true,
    },
  };

  const stream = await openRouter.chat.send(request);

  for await (const chunk of stream) {
    // Full type information for streaming responses
    const content = chunk.choices[0]?.delta?.content;
    res.write(`data: ${JSON.stringify({ content })}\n\n`);
  }
  res.write(`data: [DONE]\n\n`);
  res.end();
});

app.listen(3000);
