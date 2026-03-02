import { Router } from "express";
import { getKalshiEvent } from "../services/kalshi.service";
import { getOpenRouterResponseStream } from "../services/openrouter.service";

const router = Router();

router.post("/summarizeEvent", async (req, res, next) => {
  try {
    const { eventTicker } = req.body;

    if (!eventTicker) {
      return res.status(400).json({ error: "Event ticker is required" });
    }

    const data = await getKalshiEvent(eventTicker);

    const message = `Analyze this event: ${data.event.title} (${data.event.sub_title}) happening on ${data.markets[0].expected_expiration_time}.`
    const stream = await getOpenRouterResponseStream(message);

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();
    
    try {
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content;
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }
      res.write(`data: [DONE]\n\n`);
      res.end();
    } catch (error) {
      res.write(
        `data: ${JSON.stringify({ error: "Stream interrupted" })}\n\n`
      );
      res.end();
    }
  } catch (error) {
    next(error);
  }
});

export default router;
