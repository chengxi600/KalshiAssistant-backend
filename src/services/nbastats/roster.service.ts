import { CommonTeamRosterResponse } from "./nbastats.types";
import { ServiceError } from "../../utils/errors";
import { BASE_NBA_STATS_URL, NBA_STATS_HEADERS } from "./constants";

const TEAM_ROSTER_ENDPOINT = "commonteamroster";

export async function getTeamRoster(
  season: string,
  teamId: string,
): Promise<CommonTeamRosterResponse> {
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
        await response.text(),
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ServiceError) throw error;
    throw new ServiceError("Failed to fetch NBA team roster");
  }
}
