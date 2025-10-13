// Shared TypeScript interfaces for the RosterIQ app

// Style & fit stats
export interface FsStats {
  usg_percent: number;
  threeRate: number;
  ast_fga: number;
  fga_per100: number;
  ftr: number;
  rimRate: number;
  midRate: number;
}

// Value stats (VOCBP)
export interface VocbpStats {
  ast_percent: number;
  oreb_percent: number;
  dreb_percent: number;
  ft_percent: number;
  stl_percent: number;
  blk_percent: number;
  ts_percent: number;
}

// Success stats
export interface SuccStats {
  ts_percent: number;
  porpag: number;
  dporpag: number;
  ast_percent?: number;
  dreb_percent: number;
  oreb_percent?: number;
  stl_percent?: number;
  blk_percent?: number;
}

// Composite score item for data table
export interface CompositeScoreItem {
  player_name: string;
  sim_score: number;
  prev_team_name: string;
  vocbp_raw: number;
  sos_adj_factor: number;
  sos_z: number;
  vocbp: number;
  fit_z: number;
  value_z: number;
  comp_raw: number;
  fit_pct: number;
  value_pct: number;
  composite_pct: number;
  comp_T: number;
}

// Main API response interface
export interface HistComputeApiResponse {
  fs_bmark: FsStats;
  fs_bmark_scaled: FsStats;
  fs_plyr: FsStats;
  fs_plyr_scaled: FsStats;
  vocbp_bmark: VocbpStats;
  vocbp_bmark_scaled: VocbpStats;
  vocbp_plyr: VocbpStats;
  vocbp_plyr_scaled: VocbpStats;
  rank?: number;
  bss: number;
  ess: number;
  succ_bmark: SuccStats;
  succ_bmark_scaled: SuccStats;
  succ_plyr: SuccStats;
  succ_plyr_scaled: SuccStats;
  player_archetype_names: string[];
  player_archetype_percentages: number[];
  team_archetype: string[];
  composite_scores: CompositeScoreItem[];
}