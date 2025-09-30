import {ColumnDef} from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button";

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

export const columns: ColumnDef<RankingsPageRow>[] = [
    {
        accessorKey: "player_name",
        header: "Name",
        size: 150
    },
    {
        accessorKey: "prev_team_name",
        header: "Previous Team",
        size: 150
    },
    {
        accessorKey: "sos_adj_factor",
        header: "SOS Adjustment Factor",
        size: 150
    }, 
    {
        accessorKey: "sim_score",
        size: 150,
        header: "Fit Score"
    },
    {
        accessorKey: "vocbp",
        size: 250,
        header : "Value Over Clustered Benchmark Player"
    },
    {
        accessorKey: "composite_pct",
        header: "Composite Score Percentile",
        size: 120
    },
    {
        accessorKey: "comp_T",
        size: 120,
        header : "Composite T Score"
    },
    
    
]