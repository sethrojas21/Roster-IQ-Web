import { CompositeScoreItem, HistComputeApiResponse, SuccStats } from '@/api/histcomputeapi';
import { DataTable } from '@/components/testing/home/table/data-table';
import { columns } from '@/components/testing/rankings/columns';
import RoundedTextBox from '@/components/testing/rankings/rounded-rectangle';
import GradientTitle from '@/components/ui/gradient-title';
import { roundToDecimal } from '@/helpers';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Cell, Legend, Pie, PieChart, PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart } from 'recharts';

export default function Rankings() {
  const params = useLocalSearchParams();
  const { teamName, playerName, seasonYear, playerId, position } = params;
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<CompositeScoreItem[]>([]);
  const [bss, setBSS] = useState(0);
  const [ess, setESS] = useState(0);
  const [succ_bmark_scaled, setSuccBmarkScaled] = useState<SuccStats | null>(null);
  const [succ_plyr_scaled, setSuccPlyrScaled] = useState<SuccStats | null>(null);
  const [playerArchetypeNames, setPlayerArchetypeNames] = useState<string[]>([]);
  const [playerArchetypePercentages, setPlayerArchetypePercentages] = useState<number[]>([]);
  const [teamArchetype, setTeamArchetype] = useState<string[]>([]);
  const [rank, setRank] = useState('--/--');
  const [error, setError] = useState<string | null>(null);
  const [fullApiResponse, setFullApiResponse] = useState<HistComputeApiResponse | null>(null);

  const teamNameString = Array.isArray(teamName) ? teamName[0] : teamName;
  const uvicorn_api = `http://localhost:8080/histcompute?team_name=${teamNameString.replace(/\s/g, "_")}&season_year=${seasonYear}&player_id_to_replace=${playerId}`
  const amz_api = `https://rosteriq-931958912273.us-west1.run.app/histcompute?team_name=${teamNameString}&season_year=${seasonYear}&player_id_to_replace=${playerId}`
  
  const fetchPlayerStats = async () => {
    try {
      console.log('🚀 Fetching API data...');
      console.log('Team Name:', teamName);
      console.log('Season Year:', seasonYear);
      console.log('Player ID:', playerId);
      console.log('API URL:', uvicorn_api);
      
      const response = await fetch(uvicorn_api);
      console.log('📊 Response status:', response.status);
      console.log('📊 Response headers:', response.headers);

      if (!response.ok) {
        throw new Error(`Failed to fetch player stats (Status: ${response.status})`);
      }
      
      const data: HistComputeApiResponse = await response.json();
      console.log('✅ API Response received:', data);
      
      // Store the full API response
      setFullApiResponse(data);
      
      setStats(data.composite_scores);
      setBSS(data.bss);
      setESS(data.ess);
      setSuccBmarkScaled(data.succ_bmark_scaled)
      setSuccPlyrScaled(data.succ_plyr_scaled)
      setPlayerArchetypeNames(data.player_archetype_names);
      setPlayerArchetypePercentages(data.player_archetype_percentages);
      setTeamArchetype(data.team_archetype);
      
      // Calculate rank: find the position of the replaced player among all players
      if (data.composite_scores && data.composite_scores.length > 0) {
        const totalPlayers = data.composite_scores.length;
        const rank_num = String(Number(data.rank) + 1)
        // The rank would be the player's position + 1 (since arrays are 0-indexed)
        // For now, let's assume the first player is the replaced player or use a default rank
        setRank(`${rank_num}/${totalPlayers}`);
      } else {
        setRank('--/--');
      }
      
      setError(null); // Clear any previous errors
      
    } catch (err) {
      let errorMessage = 'An error occurred';
      
      if (err instanceof TypeError && err.message.includes('Failed to fetch')) {
        errorMessage = 'CORS Error: Your API server needs "Access-Control-Allow-Origin" headers. Make sure your uvicorn server allows requests from http://localhost:8081';
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      console.error('❌ Error fetching player stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlayerStats();
  }, [teamName, seasonYear, playerId]);

  const getSuccessData = () => {

    return [
      {
        subject: "TS%",
        benchmark: succ_bmark_scaled?.ts_percent,
        player: succ_plyr_scaled?.ts_percent
      },
      {
        subject: "PORPAG",
        benchmark: succ_bmark_scaled?.porpag,
        player: succ_plyr_scaled?.porpag
      },
      {
        subject: "DPORPAG",
        benchmark: succ_bmark_scaled?.dporpag,
        player: succ_plyr_scaled?.dporpag,
      },
      {
        subject: "DReb%",
        benchmark: succ_bmark_scaled?.dreb_percent,
        player: succ_plyr_scaled?.dreb_percent
      },
      {
        subject: "AST%",
        benchmark: succ_bmark_scaled?.ast_percent,
        player: succ_plyr_scaled?.ast_percent
      },
      {
        subject: "STL%",
        benchmark: succ_bmark_scaled?.stl_percent,
        player: succ_plyr_scaled?.stl_percent
      }
    ];
  };

  const getPlayerArchetypeData = () => {
    if (playerArchetypeNames.length === 0 || playerArchetypePercentages.length === 0) {
      // Return default data if archetype data hasn't loaded yet
      return [
        {
          name: "Loading...",
          value: 100,
          fill: "#8A5CF6"
        }
      ];
    }

    // Generate colors for each archetype
    const colors = ["#8A5CF6", "#FFFFFF", "#FF5C97", "#FF7A59", "#82ca9d"];
    
    return playerArchetypeNames.map((name, index) => ({
      name: name,
      value: Math.round(playerArchetypePercentages[index] * 100), // Convert to percentage
      fill: colors[index % colors.length]
    }));
  };


  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#000" }}>
      <View style={styles.container}>

        <GradientTitle 
          title={playerName as string}
          teamName={teamName as string}
          position={position as string}
          seasonYear={seasonYear as string}
          showMetadata={true}
        />


    
      <View style={styles.hStackContainer}>

        <View style={styles.chartContainer}>
          <Text style={[styles.subtitle, {color: "white", textAlign:'center'}]}>Player Archetype</Text>
          <PieChart width={300} height={300}>
            <Pie 
              data={getPlayerArchetypeData()} 
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
              {getPlayerArchetypeData().map((entry, index) => (
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

        <View style={styles.chartContainer}>
          <Text style={[styles.subtitle, {color: "white", textAlign:'center'}]}>Success Breakdown</Text>
          <RadarChart outerRadius={80} width={300} height={300} data={getSuccessData()}>
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" />
            <PolarRadiusAxis angle={30}/>
            <Radar name="Benchmark" dataKey="benchmark" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
            <Radar name="Player" dataKey="player" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
            <Legend />
          </RadarChart>
        </View>

        <View style={styles.chartContainer}>
          <Text style={[styles.subtitle, {color: "white", textAlign:'center'}]}>Team Archetype</Text>
          <View style={styles.chartPlaceholder}>
            <View style={styles.teamArchetypeContainer}>
              {teamArchetype.length > 0 ? (
                teamArchetype.map((archetype, index) => (
                  <Text key={index} style={styles.teamArchetypeText}>
                    {archetype}
                  </Text>
                ))
              ) : (
                <Text style={styles.teamArchetypeText}>Loading...</Text>
              )}
            </View>
          </View>
        </View>
      </View>
      
      <View style={styles.hStackContainer}>
        <RoundedTextBox title='Rank:' text={rank}></RoundedTextBox>
        <RoundedTextBox title='ESS:' text={String(roundToDecimal(ess, 3))}></RoundedTextBox>
        <RoundedTextBox title='BSS:' text={String(roundToDecimal(bss, 3))}></RoundedTextBox>

      </View>

      
      <DataTable 
        columns={columns} 
        data={stats} 
        page="breakdown" 
        apiResponse={fullApiResponse}
        teamName={teamName as string}
        position={position as string}
        seasonYear={seasonYear as string}
        playerName={playerName as string}
      />
      
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 20,
    alignItems: "center",
  },
  chartContainer: {
    alignItems: "center",
    width: 300,
    minHeight: 360, // Consistent height for all charts including title
  },
  chartPlaceholder: {
    width: 300,
    height: 300,
    justifyContent: "center",
    alignItems: "center",
  },
  teamArchetypeContainer: {
    padding: 20,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 200,
  },
  teamArchetypeText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 8,
    lineHeight: 24,
  },
  boxTitle: {
    color: "orange",
    fontSize: 18,
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 1,
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