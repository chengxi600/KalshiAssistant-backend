import { ServiceError } from "../utils/errors";

const NBA_STATS_HEADERS: Record<string, string> = {
  Accept: "application/json, text/plain, */*",
  "Accept-Encoding": "gzip, deflate, br",
  "Accept-Language": "en-US,en;q=0.9",
  "Cache-Control": "no-cache",
  Connection: "keep-alive",
  Host: "stats.nba.com",
  Origin: "https://www.nba.com",
  Pragma: "no-cache",
  Referer: "https://www.nba.com/",
  "Sec-Ch-Ua":
    '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
  "Sec-Ch-Ua-Mobile": "?0",
  "Sec-Ch-Ua-Platform": '"Windows"',
  "Sec-Fetch-Dest": "empty",
  "Sec-Fetch-Mode": "cors",
  "Sec-Fetch-Site": "same-site",
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) " +
    "AppleWebKit/537.36 (KHTML, like Gecko) " +
    "Chrome/131.0.0.0 Safari/537.36",
};

const BASE_NBA_STATS_URL = "https://stats.nba.com/stats";
const TEAM_ROSTER_ENDPOINT = "commonteamroster";

export async function getTeamRoster(
  season: string,
  teamId: string
): Promise<unknown> {
  const url = new URL(`${BASE_NBA_STATS_URL}/${TEAM_ROSTER_ENDPOINT}`);
  url.searchParams.append("Season", season);
  url.searchParams.append("TeamID", teamId);

  try {
    const response = await fetch(url.toString(), {
      method: "GET",
      headers: NBA_STATS_HEADERS,
    });

    if (!response.ok) {
      throw new ServiceError(
        "NBA Stats API error",
        response.status,
        await response.text()
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ServiceError) throw error;
    throw new ServiceError("Failed to fetch NBA team roster");
  }
}
