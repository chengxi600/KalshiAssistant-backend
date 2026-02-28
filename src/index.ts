import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { OpenRouter } from "@openrouter/sdk"
import { SendChatCompletionRequestRequest } from "@openrouter/sdk/esm/models/operations/sendchatcompletionrequest"

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

// POST method route
app.get("/stream", async (req, res) => {
  res.setHeader("Content-Type", "text/event-stream")
  res.setHeader("Cache-Control", "no-cache")
  res.setHeader("Connection", "keep-alive")
  
  const openRouter = new OpenRouter({
    apiKey: process.env["OPENROUTER_API_KEY"] ?? "",
  });

  const request: SendChatCompletionRequestRequest & {
    chatGenerationParams: {
      stream: true
    }
  } = {
    chatGenerationParams: {
      messages: [
        {
          role: "user",
          content: "Who is the best nba player?"
        }
      ],
      model: "arcee-ai/trinity-large-preview:free",
      temperature: 0.7,
      stream: true,
    }
  }

  const stream = await openRouter.chat.send(request);

  for await (const chunk of stream) {
    // Full type information for streaming responses
    const content = chunk.choices[0]?.delta?.content;
    res.write(content)
  }
  res.end()
})

app.listen(3000)