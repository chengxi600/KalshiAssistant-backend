import { ServiceError } from "../../utils/errors";
import { BASE_NBA_STATS_URL, NBA_STATS_HEADERS } from "./constants";

const ADVANCED_BOX_SCORE_ENDPOINT = "boxscoreadvancedv3";

type Period = 0 | 1 | 2 | 3 | 4 | "overtime()" | "quarter()";

export async function getAdvancedBoxScore(
  endPeriod: Period,
  endRange: number,
  gameId: string,
  rangeType: number,
  startPeriod: Period,
  startRange: number,
): Promise<any> {
  const url = new URL(`${BASE_NBA_STATS_URL}/${ADVANCED_BOX_SCORE_ENDPOINT}`);
  url.searchParams.append("EndPeriod", endPeriod.toString());
  url.searchParams.append("EndRange", endRange.toString());
  url.searchParams.append("GameID", gameId);
  url.searchParams.append("RangeType", rangeType.toString());
  url.searchParams.append("StartPeriod", startPeriod.toString());
  url.searchParams.append("StartRange", startRange.toString());

  console.log(url.toString());

  try {
    const response = await fetch(url.toString(), {
      method: "GET",
      headers: NBA_STATS_HEADERS,
    });

    if (!response.ok) {
      throw new ServiceError(
        "NBA Stats API error",
        response.status,
        await response.text(),
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ServiceError) throw error;
    throw new ServiceError("Failed to fetch NBA advanced box score");
  }
}
