import { Router } from "express";
import { getKalshiEvent } from "../services/kalshi/kalshi.service";
import { getOpenRouterResponseStream } from "../services/openrouter/openrouter.service";
import { getCurrentNBASeason } from "../utils/util";
import { getTeamRoster } from "../services/nbastats/roster.service";
import { teamCityToId } from "../constants/teams";

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

    const { eventTicker } = req.body;

    if (!eventTicker) {
      next(new Error("Event ticker is required"));
    }

    res.flushHeaders();

    const data = await getKalshiEvent(eventTicker);
    const eventCategory = data.event.category;
    const eventScope: ProductMetadata = data.event?.product_metadata ?? {};

    if (
      eventCategory !== "Sports" ||
      eventScope?.competition !== "Pro Basketball (M)"
    ) {
      console.log("Service not available for this event");
      res.write(
        `data: ${JSON.stringify({ error: "Service not available for this event" })}\n\n`,
      );
      res.end();
      return;
    }

    // check if markets doesn't exist, throw error
    if (!data.markets || data.markets.length === 0) {
      console.log("Error parsing event data");
      res.write(
        `data: ${JSON.stringify({ error: "Error parsing event data" })}\n\n`,
      );
      res.end();
      return;
    }

    // construct message
    const eventMarkets = data.markets.map((market) => {
      return {
        teamName: market.yes_sub_title,
        lastYesPrice: market.last_price_dollars,
      };
    });
    const eventMarketIds = eventMarkets.map(
      (market) => teamCityToId[market.teamName],
    );

    const teamsInfo = [];
    for (const [index, marketId] of eventMarketIds.entries()) {
      const data3 = await getTeamRoster(
        getCurrentNBASeason(),
        marketId.toString(),
      );
      teamsInfo.push({
        ...eventMarkets[index],
        players: data3.resultSets[0].rowSet.map((player) => {
          return {
            playerName: player[3],
            playerPosition: player[6],
          };
        }),
      });
    }

    const llmContext = `
You are an NBA betting analysis assistant for Kalshi.
You provide data-driven, probabilistic analysis of NBA matchups.
You will be given current prices per market.

Rules:
- Base analysis primarily on provided structured data.
- Use web search only for recent injuries or breaking news.
- Avoid generic sports commentary.
- Do not give emotional predictions.
- Focus on measurable factors: efficiency, pace, recent form, roster composition.
- If data is missing, state assumptions clearly.
    `;

    const taskContext = `
Analyze the following event: ${data.event.title} (${data.event.sub_title}) happening on ${data.markets[0].expected_expiration_time}. Provide a recommendation for the best market to bet on given the information provided.

Focus on:
  - Offensive/Defensive matchup
  - Recent form
  - Rest differential
  - Injury news if relevant

  Respond in:
  1. Key Factors
  2. Risk Factors
  3. Probabilistic Lean (No exact % unless asked)

  Output in markdown format.
    `;

    const message = `

SYSTEM:
${llmContext}

MATCHUP_DATA:
<BEGIN_DATA>
${JSON.stringify(teamsInfo)}
<END_DATA>

TASK:
${taskContext}
    `;
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
    console.error("Error summarizing event", error);
    res.write(`data: ${JSON.stringify({ error: "Error summarizing event" })}\n\n`);
    res.end();
  }
});

export default router;
