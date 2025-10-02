// types/api.ts
export type FS = {
  usg_percent: number;
  threeRate: number;
  ast_fga: number;
  fga_per100: number;
  ftr: number;
  rimRate: number;
  midRate: number;
};

export type VOCBP = {
  ast_percent: number;
  oreb_percent: number;
  dreb_percent: number;
  ft_percent: number;
  stl_percent: number;
  blk_percent: number;
  ts_percent: number;
};

export type Succ = {
  ts_percent: number;
  porpag: number;
  dporpag: number;
  ast_percent: number;
  dreb_percent: number;
  stl_percent: number;
};

export type CompositeScore = {
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
  fit_pct: number;       // 0..1
  value_pct: number;     // 0..1
  composite_pct: number; // 0..1
  comp_T: number;
};

export type ApiResponse = {
  fs_bmark: FS;
  fs_plyr: FS;
  vocbp_bmark: VOCBP;
  vocbp_plyr: VOCBP;
  bss: number;
  ess: number;
  succ_bmark: Succ;
  succ_plyr: Succ;
  composite_scores: CompositeScore[];
};