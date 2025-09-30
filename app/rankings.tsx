import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from "expo-linear-gradient";
import { Legend, Pie, PieChart, PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart } from 'recharts';
import { DataTable } from '@/components/testing/home/table/data-table';
import { columns } from '@/components/testing/rankings/columns';
import ArchetypeSplit from '@/components/testing/rankings/archetypesplit';

interface PlayerStats {
  ppg: number;
  rpg: number;
  apg: number;
  // add more stats as needed
}

const rankings_data = [
      {
      "player_name": "Demarcus Sharp",
      "sim_score": 0.94,
      "prev_team_name": "Northwestern State",
      "vocbp_raw": 1.52,
      "sos_adj_factor": 0,
      "sos_z": -1.15,
      "vocbp": 1.52,
      "fit_z": 1.72,
      "value_z": 2.48,
      "comp_raw": 2.02,
      "fit_pct": 0.99,
      "value_pct": 0.99,
      "composite_pct": 0.99,
      "comp_T": 76.18
    },
    {
            "player_name": "RJ Luis",
      "sim_score": 0.779281181085735,
      "prev_team_name": "Massachusetts",
      "vocbp_raw": 1.3334176485421,
      "sos_adj_factor": 0.0264101884994319,
      "sos_z": 0.26410188499432,
      "vocbp": 1.35982783704153,
      "fit_z": 1.46843173801353,
      "value_z": 2.22765015064131,
      "comp_raw": 1.77211910306464,
      "fit_pct": 0.967391304347826,
      "value_pct": 0.984782608695652,
      "composite_pct": 0.974347826086957,
      "comp_T": 72.9139825119946
    },
    {
            "player_name": "RJ Luis",
      "sim_score": 0.779281181085735,
      "prev_team_name": "Massachusetts",
      "vocbp_raw": 1.3334176485421,
      "sos_adj_factor": 0.0264101884994319,
      "sos_z": 0.26410188499432,
      "vocbp": 1.35982783704153,
      "fit_z": 1.46843173801353,
      "value_z": 2.22765015064131,
      "comp_raw": 1.77211910306464,
      "fit_pct": 0.967391304347826,
      "value_pct": 0.984782608695652,
      "composite_pct": 0.974347826086957,
      "comp_T": 72.9139825119946
    }
]

export default function Rankings() {
  const params = useLocalSearchParams();
  const { teamName, playerName, seasonYear, playerId, position } = params;
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<PlayerStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  // useEffect(() => {
  //   fetchPlayerStats();
  // }, [playerId, seasonYear]);

  // const fetchPlayerStats = async () => {
  //   try {
  //     // Example API URL - replace with your actual API endpoint
  //     const response = await fetch(
  //       `https://rosteriq-931958912273.us-west1.run.app/compute?team_name=${teamName}&season_year=${seasonYear}&player_id_to_replace=${playerId}`
  //     );
      
  //     if (!response.ok) {
  //       throw new Error('Failed to fetch player stats');
  //     }

  //     const data = await response.json();
  //     setStats(data.data[0] || null);
  //   } catch (err) {
  //     setError(err instanceof Error ? err.message : 'An error occurred');
  //     console.error('Error fetching player stats:', err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };


  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#000" }}>
      <View style={styles.container}>

        <View style={styles.titleBox}>
        
        <View>
          <LinearGradient
            colors={["#8A5CF6", "#FF5C97", "#FF7A59"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, borderRadius: 20}}
          />
          <Text style={[styles.title, { backgroundColor: 'transparent', padding: 10 }]}>{playerName}</Text>
        </View>

        <View style={styles.hStackContainer}>
          <Text style={styles.subtitle}>{teamName}</Text>
          <Text style={styles.bulletPoint}> - </Text>
          <Text style={styles.subtitle}>{position}</Text>
          <Text style={styles.bulletPoint}> - </Text>
          <Text style={styles.subtitle}>{seasonYear}</Text>
        </View>
      </View>


    
      <View style={styles.hStackContainer}>

        <View>
          <Text style={[styles.subtitle, {color: "white", textAlign:'center'}]}>Player Archetype Split</Text>
        <PieChart width={300} height={250}>
          <Pie 
          data={playerArchetypeSplit} 
          nameKey="name" 
          cx="50%" cy="50%" 
          outerRadius={100} 
          fill='#8884d8'
          />
        </PieChart>
        </View>

        <View>
          <Text style={[styles.subtitle, {color: "white", textAlign:'center'}]}>Success Breakdown</Text>
        <RadarChart outerRadius={90} width={300} height={250} data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" />
          <PolarRadiusAxis angle={30} domain={[0, 150]} />
          <Radar name="Mike" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
          <Radar name="Lily" dataKey="B" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
          <Legend />
        </RadarChart>
        </View>

        <View>
          <Text style={[styles.subtitle, {color: "white", textAlign:'center'}]}>Team Archetype Split</Text>
          <PieChart width={300} height={250}>
            <Pie 
            data={teamArchetypeSplit} 
            nameKey="name" 
            cx="50%" cy="50%" 
            outerRadius={100} 
            fill='#8884d8'
            />
          </PieChart>
        </View>
      </View>


      <ArchetypeSplit
        items={[{ label: "Slasher", percent: 100, color: "blue" }]}
      />

      <ArchetypeSplit
        items={[
          { label: "Slasher", percent: 60, color: "blue" },
          { label: "Shooter", percent: 40, color: "green" },
        ]}
      />

      <ArchetypeSplit
        items={[
          { label: "Slasher", percent: 90, color: "red" },
          { label: "Shooter", percent: 10, color: "yellow" },
        ]}
      />

      
      <DataTable columns={columns} data={rankings_data} page="breakdown" />
      
      </View>
    </ScrollView>
  );
}

const playerArchetypeSplit = [
  {
    "name": "Shoota",
    "value": 40
  },
  {
    "name": "Boota",
    "value": 60
  }
]

const teamArchetypeSplit = [
  {
    "name" : "Rebounda",
    "value" : 100
  }
]

const data = [
  {
    "subject": "Math",
    "A": 120,
    "B": 110,
    "fullMark": 150
  },
  {
    "subject": "Chinese",
    "A": 98,
    "B": 130,
    "fullMark": 150
  },
  {
    "subject": "English",
    "A": 86,
    "B": 130,
    "fullMark": 150
  },
  {
    "subject": "Geography",
    "A": 99,
    "B": 100,
    "fullMark": 150
  },
  {
    "subject": "Physics",
    "A": 85,
    "B": 90,
    "fullMark": 150
  },
  {
    "subject": "History",
    "A": 65,
    "B": 85,
    "fullMark": 150
  }
]

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 20,
    alignItems: "center",
  },
  titleBox: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    width: "100%",
    alignItems: "center",
  },
  boxTitle: {
    color: "orange",
    fontSize: 18,
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    color: "white",
    marginBottom: 4,
    textAlign: "center",
  },
  hStackContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 24,
    color: "white",
  },
  bulletPoint: {
    color: "purple",
    fontSize: 30,
  },
  loader: {
    marginTop: 20,
  },
  errorText: {
    color: "#ff6b6b",
    fontSize: 16,
    marginTop: 20,
    textAlign: "center",
  },
  noDataText: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 16,
    marginTop: 20,
    textAlign: "center",
  },
  statsContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 12,
    width: "100%",
    maxWidth: 400,
  },
  statText: {
    color: "white",
    fontSize: 18,
    marginBottom: 8,
  },
});