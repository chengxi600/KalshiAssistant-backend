import { CumeStatsTeamGamesResponse } from "./nbastats.types";
import { ServiceError } from "../../utils/errors";
import { BASE_NBA_STATS_URL, NBA_STATS_HEADERS } from "./constants";

const CUME_STATS_ENDPOINT = "cumestatsteamgames";

type SeasonType = "Regular Season" | "Playoffs" | "Pre Season" | "All Star";

// 00: NBA, 01: ABA, 20: G League, 10: WNBA
type LeagueID = "00" | "01" | "20" | "10";

export async function getTeamCumulativeStats(
  season: string,
  teamId: string,
  vsTeamId?: string,
  seasonType: SeasonType = "Regular Season",
  leagueId: LeagueID = "00",
): Promise<CumeStatsTeamGamesResponse> {
  const url = new URL(`${BASE_NBA_STATS_URL}/${CUME_STATS_ENDPOINT}`);
  url.searchParams.append("LeagueID", leagueId);
  url.searchParams.append("Season", season);
  url.searchParams.append("SeasonType", seasonType);
  url.searchParams.append("TeamID", teamId);
  url.searchParams.append("VsTeamID", vsTeamId ?? "");

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
    throw new ServiceError("Failed to fetch NBA team roster");
  }
}
