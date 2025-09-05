import PlayerCard from "@/components/testing/home/topplayercard";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
// @ts-ignore
import { players } from "../data/players";

import { createClient } from "@libsql/client/web";

export const db = createClient({
  url: "libsql://rosteriq-sethrojas21.aws-us-west-2.turso.io",
  authToken: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NTY5NDM5MDksImlkIjoiMWM5ZDQ1NTMtMWQwZS00YTQwLWJiZTYtZTVjMmUxYjBjYjY4IiwicmlkIjoiMDFjNGYyYTctYmRlZC00NTNlLWJiNmMtNGEzZGFhZDUyYTI0In0.VONEyhtlIbxU0AQAipd7AiQkQIQaZ8755J1DmkV2mAshr49kRkBCawMPFgmVtW9gQzBR3OJkJl2F2ao6c8lJBw",
});

async function getTransfers() {
  try {
    const result = await db.execute("SELECT * FROM Home_page");
    return result.rows; // Access the fetched data
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}

export default function Index() {
  const [transfers, setTransfers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTransfers() {
      try {
        const rows = await getTransfers();
        setTransfers(rows);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchTransfers();
  }, []);

  return (
    <View style={styles.container}>
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
      
      <Text style={styles.header}>Player Search</Text>
      
      {loading ? (
        <ActivityIndicator size="large" color="#fff" style={styles.loader} />
      ) : (
        <ScrollView style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={styles.headerCell}>Name</Text>
            <Text style={styles.headerCell}>Team</Text>
            <Text style={styles.headerCell}>Position</Text>
            <Text style={styles.headerCell}>Year</Text>
            <Text style={styles.headerCell}>Height</Text>
          </View>
          <ScrollView>
            {transfers.map((player, index) => (
              <Pressable 
                key={index}
                style={({ pressed }) => [
                  styles.tableRow,
                  index % 2 === 0 && styles.evenRow,
                  pressed && styles.pressedRow
                ]}
                onPress={() => {
                  router.push({
                    pathname: "/rankings",
                    params: {
                      teamName: player.team_name,
                      playerName: player.player_name,
                      seasonYear: player.season_year,
                      playerId: player.player_id
                    }
                  });
                }}
              >
                <Text style={styles.cell}>{player.player_name}</Text>
                <Text style={styles.cell}>{player.team_name}</Text>
                <Text style={styles.cell}>{player.position}</Text>
                <Text style={styles.cell}>{player.player_year}</Text>
                <Text style={styles.cell}>{player.height_inches}"</Text>
              </Pressable>
            ))}
          </ScrollView>
        </ScrollView>
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 16,
    textAlign: 'left',
  },
  scrollContent: {
    paddingHorizontal: 12,
    paddingVertical: 20,
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