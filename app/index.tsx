import { columns, HomePageRow } from "@/components/testing/home/table/columns";
import { DataTable } from "@/components/testing/home/table/data-table";
import PlayerCard from "@/components/testing/home/topplayercard";
import { createClient } from "@libsql/client/web";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import webHomepageJson from "../assets/data/web_homepage.json";
import { players } from "../data/players";

export const db = createClient({
  url: "libsql://rosteriq-sethrojas21.aws-us-west-2.turso.io",
  authToken: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NTY5NDM5MDksImlkIjoiMWM5ZDQ1NTMtMWQwZS00YTQwLWJiZTYtZTVjMmUxYjBjYjY4IiwicmlkIjoiMDFjNGYyYTctYmRlZC00NTNlLWJiNmMtNGEzZGFhZDUyYTI0In0.VONEyhtlIbxU0AQAipd7AiQkQIQaZ8755J1DmkV2mAshr49kRkBCawMPFgmVtW9gQzBR3OJkJl2F2ao6c8lJBw",
});

async function getTransfers(): Promise<HomePageRow[]> {
  try {
    const result = await db.execute("SELECT * FROM Home_page");
    
    return result.rows.map(row => ({
      season_year: Number(row.season_year),
      player_name: String(row.player_name),
      player_id: Number(row.player_id),
      player_year: Number(row.player_year),
      team_name: String(row.team_name),
      position: String(row.position),
      height_inches: Number(row.height_inches || 0)
    }));

  } catch (error) {
    console.error("Error fetching transfers:", error);
    throw error;
  }
}


async function getFakeTransfers(): Promise<HomePageRow[]> {
  return [
    {
      season_year: 2024,
      player_name: "Caleb Love",
      player_id: 72413,
      player_year: 3,
      team_name: "Arizona",
      position: "Guard",
      height_inches: 72
    }
  ]
}

async function getStaticTransfers(): Promise<HomePageRow[]> {
  // webHomepageJson is expected to be an array of row objects
  const rows = (webHomepageJson as any[]) || [];
  return rows.map((r: any) => ({
    season_year: Number(r.season_year),
    player_name: String(r.player_name),
    player_id: Number(r.player_id),
    player_year: Number(r.player_year),
    team_name: String(r.team_name),
    position: String(r.position),
    height_inches: Number(r.height_inches ?? 0),
  }));
}

export default function Index() {
  const [data, setData] = useState<HomePageRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await getStaticTransfers();
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={true}>
      <View style={styles.topSection}>
        <Text style={styles.header}>Top Transfers</Text>
        <ScrollView 
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {players.map((player, index) => (
            <PlayerCard 
              key={player.name}
              name={player.name}
              year={player.year}
              team={player.team}
              position={player.position}
              gradientLevel={(index % 4) + 1}
            />
          ))}
        </ScrollView>
      </View>
      
      <View style={[styles.searchSection, styles.side_padding, {padding : 20}]}>
        <Text style={[styles.header, {paddingBottom:20}]}>Player Search</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#fff" style={styles.loader} />
        ) : (
          <DataTable columns={columns} data={data} page="rankings" />
        )}
      </View>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  topSection: {
    backgroundColor: '#000',
    marginBottom: 0,
  },
  searchSection: {
    backgroundColor: '#000',
    minHeight: 600, // Ensure enough height for the table and pagination
  },
  side_padding: {
    paddingVertical: 0,
    paddingHorizontal: 24
  },
  header: {
    color: "white",
    fontSize: 24,
    fontWeight: 'bold',
    paddingHorizontal: 24,
    paddingTop: 5,
    paddingBottom: 8,
    textAlign: 'left',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 0,
    paddingBottom: 20,
    alignItems: 'center',
  },
  standard: {
    color: "white"
  },
  loader: {
    marginTop: 20,
  },
  tableContainer: {
    flex: 1,
    marginHorizontal: 24,
    marginBottom: 24,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  headerCell: {
    flex: 1,
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    paddingHorizontal: 8,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  evenRow: {
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  cell: {
    flex: 1,
    color: 'white',
    fontSize: 14,
    paddingHorizontal: 8,
  },
  pressedRow: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    opacity: 0.8,
  }
});