import { Router } from "express";
import { getKalshiEvent } from "../services/kalshi/kalshi.service";
import { getOpenRouterResponseStream } from "../services/openrouter/openrouter.service";

const router = Router();

type ProductMetadata = {
  competition?: string;
  competition_scope?: string;
};

router.post("/summarizeEvent", async (req, res, next) => {
  try {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    const { eventTicker } = req.body;

    if (!eventTicker) {
      next(new Error("Event ticker is required"));
    }

    // const data2 = await getTeamCumulativeStats(
    //   getCurrentNBASeason(),
    //   "1610612738",
    // );
    // console.log(data2.resultSets[0].rowSet);

    // const data3 = await getTeamRoster(getCurrentNBASeason(), "1610612738");
    // console.log(data3.resultSets[0].rowSet);

    const data = await getKalshiEvent(eventTicker);

    const eventCategory = data.event.category;
    const eventScope: ProductMetadata = data.event?.product_metadata ?? {};

    if (
      eventCategory !== "Sports" ||
      eventScope?.competition !== "Pro Basketball (M)"
    ) {
      res.write(
        `data: ${JSON.stringify({ error: "Service not available for this event" })}\n\n`,
      );
      res.end();
      return;
    }

    const message = `Analyze this event: ${data.event.title} (${data.event.sub_title}) happening on ${data.markets[0].expected_expiration_time}.`;
    const stream = await getOpenRouterResponseStream(message);

    try {
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content;
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }
      res.write(`data: [DONE]\n\n`);
      res.end();
    } catch (error) {
      res.write(`data: ${JSON.stringify({ error: "Stream interrupted" })}\n\n`);
      res.end();
    }
  } catch (error) {
    next(error);
  }
});

export default router;
