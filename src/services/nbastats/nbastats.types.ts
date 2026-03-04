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

export interface AdvancedBoxScoreResponse {
  meta: Meta;
  boxScoreAdvanced: AdvancedBoxScore;
}

export interface Meta {
  version: number;
  request: string;
  time: string; // ISO timestamp
}

export interface AdvancedBoxScore {
  gameId: string;
  awayTeamId: number;
  homeTeamId: number;
  homeTeam: TeamBoxScoreAdvanced;
  awayTeam: TeamBoxScoreAdvanced;
}

export interface TeamBoxScoreAdvanced {
  teamId: number;
  teamCity: string;
  teamName: string;
  teamTricode: string;
  teamSlug: string;
  players: PlayerAdvanced[];
  statistics: TeamAdvancedStatistics;
}

export interface PlayerAdvanced {
  personId: number;
  firstName: string;
  familyName: string;
  nameI: string;
  playerSlug: string;
  position: string;
  comment: string;
  jerseyNum: string;
  statistics: AdvancedStatsBase;
}

export type AdvancedStatsBase = {
  minutes: string;
  estimatedOffensiveRating: number;
  offensiveRating: number;
  estimatedDefensiveRating: number;
  defensiveRating: number;
  estimatedNetRating: number;
  netRating: number;
  assistPercentage: number;
  assistToTurnover: number;
  assistRatio: number;
  offensiveReboundPercentage: number;
  defensiveReboundPercentage: number;
  reboundPercentage: number;
  turnoverRatio: number;
  effectiveFieldGoalPercentage: number;
  trueShootingPercentage: number;
  usagePercentage: number;
  estimatedUsagePercentage: number;
  estimatedPace: number;
  pace: number;
  pacePer40: number;
  possessions: number;
  PIE: number;
};

export type TeamAdvancedStatistics = AdvancedStatsBase & {
  estimatedTeamTurnoverPercentage: number;
};
