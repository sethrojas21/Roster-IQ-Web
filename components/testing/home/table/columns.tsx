export type HomePageRow = {
  season_year: number;
  player_name: string;
  player_id: number;
  player_year: number;
  team_name: string;
  position: string;
  height_inches: number;
};

interface Column<T> {
  key: string;
  header: string;
  accessor: (item: T) => any;
  sortable?: boolean;
  width?: number | string;
  flex?: number;
}

export const columns: Column<HomePageRow>[] = [
    {
        key: "player_name",
        header: "Name",
        accessor: (item) => item.player_name,
        sortable: true,
        flex: 3 // Wider for names
    },
    {
        key: "team_name",
        header: "Previous Team",
        accessor: (item) => item.team_name,
        sortable: true,
        flex: 3 // Wider for team names
    },
    {
        key: "season_year",
        header: "Season Transferred",
        accessor: (item) => item.season_year,
        sortable: true,
        flex: 2 // Medium width
    }, 
    {
        key: "player_year",
        header: "Class",
        accessor: (item) => item.player_year,
        sortable: true,
        flex: 1 // Narrow
    },
    {
        key: "position",
        header: "Position",
        accessor: (item) => item.position,
        sortable: true,
        flex: 2 // Medium width
    },
    {
        key: "height_inches",
        header: "Height",
        accessor: (item) => `${Math.floor(item.height_inches / 12)}'${item.height_inches % 12}"`,
        sortable: true,
        flex: 1 // Narrow for height
    },
]