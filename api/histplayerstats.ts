// Interface for the player stats object within the API response
export interface HistPlayerStats {
  player_name: string;
  usg_percent: number;
  ts_percent: number;
  ast_percent: number;
  oreb_percent: number;
  dreb_percent: number;
  tov_percent: number;
  ft_percent: number;
  stl_percent: number;
  blk_percent: number;
  ftr: number;
  threeRate: number;
  ast_fga: number;
  fga_per100: number;
  rimRate: number;
  midRate: number;
  porpag: number;
  dporpag: number;
}

// Interface for the complete API response
export interface HistPlayerStatsApiResponse {
  player_stats: HistPlayerStats;
  player_name: string;
  team_name: string;
  season_year: number;
}