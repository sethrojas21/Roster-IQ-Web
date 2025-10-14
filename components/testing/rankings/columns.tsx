export type RankingsPageRow = {
      player_name: string,
      sim_score: number,
      prev_team_name: string,
      vocbp_raw: number,
      sos_adj_factor: number,
      sos_z: number,
      vocbp: number,
      fit_z: number,
      value_z: number,
      comp_raw: number,
      fit_pct: number,
      value_pct: number,
      composite_pct: number,
      comp_T: number
}

interface Column<T> {
  key: string;
  header: string;
  accessor: (item: T) => any;
  sortable?: boolean;
  width?: number | string;
  flex?: number;
}

export const columns: Column<RankingsPageRow>[] = [
    {
        key: "player_name",
        header: "Name",
        accessor: (item) => item.player_name,
        sortable: true,
        flex: 2
    },
    {
        key: "prev_team_name",
        header: "Previous Team", 
        accessor: (item) => item.prev_team_name,
        sortable: true,
        flex: 2
    },
    {
        key: "sos_adj_factor",
        header: "SOS Adj",
        accessor: (item) => item.sos_adj_factor.toFixed(3),
        sortable: true,
        flex: 1
    }, 
    {
        key: "sim_score",
        header: "Fit Score",
        accessor: (item) => item.sim_score.toFixed(3),
        sortable: true,
        flex: 1
    },
    {
        key: "vocbp",
        header: "VOCBP",
        accessor: (item) => item.vocbp.toFixed(3),
        sortable: true,
        flex: 1
    },
    {
        key: "comp_raw",
        header: "RVI",
        accessor: (item) => item.comp_raw.toFixed(3),
        sortable: true,
        flex: 1
    },
    {
        key: "composite_pct",
        header: "Composite %",
        accessor: (item) => (item.composite_pct * 100).toFixed(1) + '%',
        sortable: true,
        flex: 1
    },
    {
        key: "comp_T",
        header: "T Score",
        accessor: (item) => item.comp_T.toFixed(1),
        sortable: true,
        flex: 1
    },
]