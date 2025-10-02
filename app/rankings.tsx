import { DataTable } from '@/components/testing/home/table/data-table';
import ArchetypeSplit from '@/components/testing/rankings/archetypesplit';
import { columns } from '@/components/testing/rankings/columns';
import RoundedTextBox from '@/components/testing/rankings/rounded-rectangle';
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Cell, Legend, Pie, PieChart, PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart } from 'recharts';

type RankingCardProp = {
  player_name : string,
  sim_score : number,
  prev_team_name : string,
  vocbp_raw : number,
  sos_adj_factor : number,
  sos_z : number,
  vocbp : number,
  fit_z : number,
  value_z : number,
  comp_raw : number,
  fit_pct : number,
  value_pct : number,
  composite_pct : number,
  comp_T: number
};

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
  const [stats, setStats] = useState<RankingCardProp | null>(null);
  const [error, setError] = useState<string | null>(null);

  const uvicorn_api = `http://127.0.0.1:8000/histcompute?team_name=${teamName}&season_year=${seasonYear}&player_id_to_replace=${playerId}`
  const amz_api = `https://rosteriq-931958912273.us-west1.run.app/histcompute?team_name=${teamName}&season_year=${seasonYear}&player_id_to_replace=${playerId}`

  useEffect(() => {
    fetchPlayerStats();
  }, [playerId, seasonYear]);

  const fetchPlayerStats = async () => {
    try {
      // Example API URL - replace with your actual API endpoint
      const response = await fetch(uvicorn_api);
      


      
      if (!response.ok) {
        throw new Error('Failed to fetch player stats');
      }

      const data = await response.json();
      setStats(data.data[0] || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching player stats:', err);
    } finally {
      setLoading(false);
    }
  };


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
              dataKey="value"
              nameKey="name"
              cx="50%" 
              cy="50%" 
              outerRadius={80}
              innerRadius={20}
              paddingAngle={2}
              stroke="#000"
              strokeWidth={2}
              animationBegin={0}
              animationDuration={800}
            >
              {playerArchetypeSplit.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.fill}
                  style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' }}
                />
              ))}
            </Pie>
            <Legend 
              verticalAlign="bottom" 
              height={36}
              iconType="circle"
              wrapperStyle={{ color: 'white', fontSize: '14px' }}
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
          <ArchetypeSplit
            items={[{ label: "Slasher", percent: 100, color: "blue" }]}
          />
        </View>
      </View>
      
      <View style={styles.hStackContainer}>
        <RoundedTextBox title='Rank:' text='46/403'></RoundedTextBox>
        <RoundedTextBox title='ESS:' text='39.022'></RoundedTextBox>
        <RoundedTextBox title='BSS:' text='-0.23'></RoundedTextBox>

      </View>

      
      <DataTable columns={columns} data={rankings_data} page="breakdown" />
      
      </View>
    </ScrollView>
  );
}

const playerArchetypeSplit = [
  {
    "name": "Slasher",
    "value": 65,
    "fill": "#8A5CF6" // Purple gradient color
  },
  {
    "name": "Shooter", 
    "value": 35,
    "fill": "#FFFFFF" // White
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
    gap : 20
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