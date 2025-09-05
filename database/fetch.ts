// fetchHomePage.ts
import { db } from "./db";

// type-safe definition of a row
export type HomePageRow = {
  season_year: number;
  player_name: string;
  player_id: number;
  player_year: number;
  team_name: string;
  position: string;
  height_inches: number;
};

// fetch entire table
export async function fetchHomePage(): Promise<HomePageRow[]> {
  const rs = await db.execute("SELECT * FROM home_page");

  // Convert to plain objects with correct typing
  return rs.rows.map((row) => ({
    season_year: Number(row.season_year),
    player_name: String(row.player_name),
    player_id: Number(row.player_id),
    player_year: Number(row.player_year),
    team_name: String(row.team_name),
    position: String(row.position),
    height_inches: Number(row.height_inches),
  }));
}