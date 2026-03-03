export interface CumeStatsTeamGamesResponse {
  resource: "cumestatsteamgames";
  parameters: {
    LeagueID: string;
    SeasonID: string;
    SeasonType: string;
    TeamID: number;
    Location: string | null;
    Outcome: string | null;
    VsTeamID: number | null;
    VsDivision: string | null;
    VsConference: string | null;
  };
  resultSets: [
    {
      name: "CumeStatsTeamGames";
      headers: string[];
      rowSet: CumeStatsTeamGamesRow[];
    },
  ];
}

type CumeStatsTeamGamesRow = [matchup: string, gameId: string];

export interface CommonTeamRosterResponse {
  resource: "commonteamroster";
  parameters: {
    TeamID: number;
    LeagueID: string;
    Season: string;
  };
  resultSets: [
    {
      name: "CommonTeamRoster";
      headers: string[];
      rowSet: CommonTeamRosterPlayerRow[];
    },
    {
      name: "Coaches";
      headers: string[];
      rowSet: CommonTeamRosterCoachRow[];
    },
  ];
}

export type CommonTeamRosterPlayerRow = [
  teamId: number,
  season: string,
  leagueId: string,
  player: string,
  playerSlug: string,
  num: string | null,
  position: string,
  height: string,
  weight: string,
  birthDate: string,
  age: number,
  exp: string,
  school: string,
  playerId: number,
];

export type CommonTeamRosterCoachRow = [
  teamId: number,
  season: string,
  coachId: string,
  firstName: string,
  lastName: string,
  coachName: string,
  isAssistant: number,
  coachType: string,
  sortSequence: number,
];
