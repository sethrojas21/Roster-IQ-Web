import {ColumnDef} from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button";
export type HomePageRow = {
  season_year: number;
  player_name: string;
  player_id: number;
  player_year: number;
  team_name: string;
  position: string;
  height_inches: number;
};

export const columns: ColumnDef<HomePageRow>[] = [
    {
        accessorKey : "player_name",
        header: ({ column }) => {
            return (
                <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                Name
                <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
            },
    },
    {
        accessorKey: "team_name",
        header: "Previous Team"
    },
    {
        accessorKey : "season_year",
        header : "Season Transfered"
    }, 
    {
        accessorKey: "player_year",
        header: "Class"
    },
    {
        accessorKey: "position",
        header: "Position"
    },
    {
        accessorKey: "height_inches",
        header: "Height (in)"
    },
    
    
]