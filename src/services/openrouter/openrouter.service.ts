import { OpenRouter } from "@openrouter/sdk";
import { EventStream } from "@openrouter/sdk/esm/lib/event-streams";
import {
  ChatResponse,
  ChatStreamingResponseChunk,
} from "@openrouter/sdk/esm/models";
import { SendChatCompletionRequestRequest } from "@openrouter/sdk/esm/models/operations/sendchatcompletionrequest";
import dotenv from "dotenv";
import { ServiceError } from "../../utils/errors";

dotenv.config();

const openRouter = new OpenRouter({
  apiKey: process.env["OPENROUTER_API_KEY"] ?? "",
});

export async function getOpenRouterResponseStream(
  message: string,
): Promise<EventStream<ChatStreamingResponseChunk>> {
  const request: SendChatCompletionRequestRequest & {
    chatGenerationParams: { stream: true };
  } = {
    chatGenerationParams: {
      messages: [{ role: "user", content: message }],
      reasoning: { effort: "medium" },
      plugins: [{ id: "web", maxResults: 5 }, { id: "response-healing" }],
      model: "arcee-ai/trinity-large-preview:free",
      temperature: 0.7,
      stream: true,
    },
  };

  try {
    return await openRouter.chat.send(request);
  } catch (error) {
    throw new ServiceError(
      "OpenRouter streaming request failed",
      502,
      error instanceof Error ? error.message : String(error),
    );
  }
}

export async function getOpenRouterResponse(
  message: string,
): Promise<ChatResponse> {
  const request: SendChatCompletionRequestRequest & {
    chatGenerationParams: { stream: false };
  } = {
    chatGenerationParams: {
      messages: [{ role: "user", content: message }],
      reasoning: { effort: "medium" },
      plugins: [{ id: "web", maxResults: 5 }, { id: "response-healing" }],
      model: "arcee-ai/trinity-large-preview:free",
      temperature: 0.7,
      stream: false,
    },
  };

  try {
    return await openRouter.chat.send(request);
  } catch (error) {
    throw new ServiceError(
      "OpenRouter request failed",
      502,
      error instanceof Error ? error.message : String(error),
    );
  }
}
