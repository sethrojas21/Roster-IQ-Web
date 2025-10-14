import { HistComputeApiResponse } from '@/api/histcomputeapi';
import { HistPlayerStatsApiResponse } from '@/api/histplayerstats';
import { DataTable } from '@/components/testing/home/table/data-table';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

// Interface for the fit table data
interface FitTableRow {
  player: string;
  usg_percent: number;
  threeRate: number;
  ast_fga: number;
  fga_per100: number;
  ftr: number;
  rimRate: number;
  midRate: number;
}

// Interface for the value table data
interface ValueTableRow {
  player: string;
  ast_percent: number;
  oreb_percent: number;
  dreb_percent: number;
  ft_percent: number;
  stl_percent: number;
  blk_percent: number;
  ts_percent: number;
}

// Interface for the success table data
interface SuccessTableRow {
  player: string;
  ts_percent: number;
  porpag: number;
  dporpag: number;
  ast_percent?: number;
  dreb_percent: number;
  oreb_percent?: number;
  stl_percent?: number;
  blk_percent?: number;
}

export default function PlayerBreakdown() {
    const params = useLocalSearchParams();
    const { 
        displayPlayerName, 
        displayPlayerTeam, 
        displayPlayerPosition,
        apiData 
    } = params;

    // State for player stats API response
    const [playerStats, setPlayerStats] = useState<HistPlayerStatsApiResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Extract comparison player parameters and ensure they're strings
    const comparisonPlayerName = Array.isArray(params.comparisonPlayerName) 
        ? params.comparisonPlayerName[0] 
        : params.comparisonPlayerName;
    const comparisonPlayerTeam = Array.isArray(params.comparisonPlayerTeam) 
        ? params.comparisonPlayerTeam[0] 
        : params.comparisonPlayerTeam;
    const seasonYear = Number(Array.isArray(params.seasonYear) 
        ? params.seasonYear[0] 
        : params.seasonYear);

    // Parse the API data if it exists
    let apiResponse: HistComputeApiResponse | null = null;
    try {
        if (apiData && typeof apiData === 'string') {
            apiResponse = JSON.parse(apiData);
        }
    } catch (error) {
        console.error('Failed to parse API data:', error);
    }
    
    const histplayerstatsapiep = `http://localhost:8080/histplayerstats?player_name=${comparisonPlayerName?.replace(/\s/g, "_")}&prev_team_name=${comparisonPlayerTeam?.replace(/\s/g, "_")}&season_year=${seasonYear - 1 || 2020}`;

    // Fetch player stats
    const fetchPlayerStats = async () => {
        if (!comparisonPlayerName || !comparisonPlayerTeam) {
            return;
        }

        setLoading(true);
        setError(null);

        try {
            console.log('🚀 Fetching player stats from:', histplayerstatsapiep);
            
            const response = await fetch(histplayerstatsapiep);
            console.log('📊 Response status:', response.status);

            if (!response.ok) {
                throw new Error(`Failed to fetch player stats (Status: ${response.status})`);
            }
            
            const data: HistPlayerStatsApiResponse = await response.json();
            console.log('✅ Player stats API Response received:', data);
            
            setPlayerStats(data);
            setError(null);
            
        } catch (err) {
            let errorMessage = 'An error occurred while fetching player stats';
            
            if (err instanceof TypeError && err.message.includes('Failed to fetch')) {
                errorMessage = 'CORS Error: Unable to connect to the API server';
            } else if (err instanceof Error) {
                errorMessage = err.message;
            }
            
            setError(errorMessage);
            console.error('❌ Error fetching player stats:', err);
        } finally {
            setLoading(false);
        }
    };

    // Fetch data when component mounts or when comparison player changes
    useEffect(() => {
        fetchPlayerStats();
    }, [comparisonPlayerName, comparisonPlayerTeam, seasonYear]);

    // Create fit table columns dynamically based on benchmark data
    const getFitTableColumns = () => {
        const baseColumns = [
            {
                key: 'player',
                header: 'Player',
                accessor: (item: FitTableRow) => item.player,
                sortable: true,
                width: 150
            }
        ];

        if (!apiResponse?.fs_bmark) return baseColumns;

        const potentialColumns = [
            { key: 'usg_percent', header: 'Usage %', format: (val: number) => val?.toFixed(1) + '%' },
            { key: 'threeRate', header: '3P Rate', format: (val: number) => val?.toFixed(3) },
            { key: 'ast_fga', header: 'AST/FGA', format: (val: number) => val?.toFixed(3) },
            { key: 'fga_per100', header: 'FGA/100', format: (val: number) => val?.toFixed(1) },
            { key: 'ftr', header: 'FTR', format: (val: number) => val?.toFixed(3) },
            { key: 'rimRate', header: 'Rim Rate', format: (val: number) => val?.toFixed(3) },
            { key: 'midRate', header: 'Mid Rate', format: (val: number) => val?.toFixed(3) }
        ];

        potentialColumns.forEach(col => {
            if (apiResponse.fs_bmark[col.key as keyof typeof apiResponse.fs_bmark] !== undefined) {
                baseColumns.push({
                    key: col.key,
                    header: col.header,
                    accessor: (item: FitTableRow) => col.format(item[col.key as keyof FitTableRow] as number),
                    sortable: true
                } as any);
            }
        });

        return baseColumns;
    };

    const fitTableColumns = getFitTableColumns();

    // Create fit table data
    const getFitTableData = (): FitTableRow[] => {
        const data: FitTableRow[] = [];

        // Add benchmark row
        if (apiResponse?.fs_bmark) {
            data.push({
                player: 'Benchmark',
                usg_percent: apiResponse.fs_bmark.usg_percent,
                threeRate: apiResponse.fs_bmark.threeRate,
                ast_fga: apiResponse.fs_bmark.ast_fga,
                fga_per100: apiResponse.fs_bmark.fga_per100,
                ftr: apiResponse.fs_bmark.ftr,
                rimRate: apiResponse.fs_bmark.rimRate,
                midRate: apiResponse.fs_bmark.midRate
            });
        }

        // Add display player row
        if (apiResponse?.fs_plyr && displayPlayerName) {
            data.push({
                player: displayPlayerName as string,
                usg_percent: apiResponse.fs_plyr.usg_percent,
                threeRate: apiResponse.fs_plyr.threeRate,
                ast_fga: apiResponse.fs_plyr.ast_fga,
                fga_per100: apiResponse.fs_plyr.fga_per100,
                ftr: apiResponse.fs_plyr.ftr,
                rimRate: apiResponse.fs_plyr.rimRate,
                midRate: apiResponse.fs_plyr.midRate
            });
        }

        // Add comparison player row
        if (playerStats?.player_stats && comparisonPlayerName) {
            data.push({
                player: comparisonPlayerName as string,
                usg_percent: playerStats.player_stats.usg_percent,
                threeRate: playerStats.player_stats.threeRate,
                ast_fga: playerStats.player_stats.ast_fga,
                fga_per100: playerStats.player_stats.fga_per100,
                ftr: playerStats.player_stats.ftr,
                rimRate: playerStats.player_stats.rimRate,
                midRate: playerStats.player_stats.midRate
            });
        }

        return data;
    };

    // Create value table columns dynamically based on benchmark data
    const getValueTableColumns = () => {
        const baseColumns = [
            {
                key: 'player',
                header: 'Player',
                accessor: (item: ValueTableRow) => item.player,
                sortable: true,
                width: 150
            }
        ];

        if (!apiResponse?.vocbp_bmark) return baseColumns;

        const potentialColumns = [
            { key: 'ast_percent', header: 'AST %', format: (val: number) => val?.toFixed(1) + '%' },
            { key: 'oreb_percent', header: 'OREB %', format: (val: number) => val?.toFixed(1) + '%' },
            { key: 'dreb_percent', header: 'DREB %', format: (val: number) => val?.toFixed(1) + '%' },
            { key: 'ft_percent', header: 'FT %', format: (val: number) => val?.toFixed(1) + '%' },
            { key: 'stl_percent', header: 'STL %', format: (val: number) => val?.toFixed(1) + '%' },
            { key: 'blk_percent', header: 'BLK %', format: (val: number) => val?.toFixed(1) + '%' },
            { key: 'ts_percent', header: 'TS %', format: (val: number) => val?.toFixed(1) + '%' }
        ];

        potentialColumns.forEach(col => {
            if (apiResponse.vocbp_bmark[col.key as keyof typeof apiResponse.vocbp_bmark] !== undefined) {
                baseColumns.push({
                    key: col.key,
                    header: col.header,
                    accessor: (item: ValueTableRow) => col.format(item[col.key as keyof ValueTableRow] as number),
                    sortable: true
                } as any);
            }
        });

        return baseColumns;
    };

    const valueTableColumns = getValueTableColumns();

    // Create value table data
    const getValueTableData = (): ValueTableRow[] => {
        const data: ValueTableRow[] = [];

        // Add benchmark row
        if (apiResponse?.vocbp_bmark) {
            data.push({
                player: 'Benchmark',
                ast_percent: apiResponse.vocbp_bmark.ast_percent,
                oreb_percent: apiResponse.vocbp_bmark.oreb_percent,
                dreb_percent: apiResponse.vocbp_bmark.dreb_percent,
                ft_percent: apiResponse.vocbp_bmark.ft_percent,
                stl_percent: apiResponse.vocbp_bmark.stl_percent,
                blk_percent: apiResponse.vocbp_bmark.blk_percent,
                ts_percent: apiResponse.vocbp_bmark.ts_percent
            });
        }

        // Add display player row
        if (apiResponse?.vocbp_plyr && displayPlayerName) {
            data.push({
                player: displayPlayerName as string,
                ast_percent: apiResponse.vocbp_plyr.ast_percent,
                oreb_percent: apiResponse.vocbp_plyr.oreb_percent,
                dreb_percent: apiResponse.vocbp_plyr.dreb_percent,
                ft_percent: apiResponse.vocbp_plyr.ft_percent,
                stl_percent: apiResponse.vocbp_plyr.stl_percent,
                blk_percent: apiResponse.vocbp_plyr.blk_percent,
                ts_percent: apiResponse.vocbp_plyr.ts_percent
            });
        }

        // Add comparison player row
        if (playerStats?.player_stats && comparisonPlayerName) {
            data.push({
                player: comparisonPlayerName as string,
                ast_percent: playerStats.player_stats.ast_percent,
                oreb_percent: playerStats.player_stats.oreb_percent,
                dreb_percent: playerStats.player_stats.dreb_percent,
                ft_percent: playerStats.player_stats.ft_percent,
                stl_percent: playerStats.player_stats.stl_percent,
                blk_percent: playerStats.player_stats.blk_percent,
                ts_percent: playerStats.player_stats.ts_percent
            });
        }

        return data;
    };

    // Create success table columns dynamically based on benchmark data
    const getSuccessTableColumns = () => {
        const baseColumns = [
            {
                key: 'player',
                header: 'Player',
                accessor: (item: SuccessTableRow) => item.player,
                sortable: true,
                width: 150
            }
        ];

        if (!apiResponse?.succ_bmark) return baseColumns;

        const potentialColumns = [
            { key: 'ts_percent', header: 'TS %', format: (val: number) => val?.toFixed(1) + '%', required: true },
            { key: 'porpag', header: 'PORPAG', format: (val: number) => val?.toFixed(3), required: true },
            { key: 'dporpag', header: 'DPORPAG', format: (val: number) => val?.toFixed(3), required: true },
            { key: 'ast_percent', header: 'AST %', format: (val: number) => val?.toFixed(1) + '%', required: false },
            { key: 'dreb_percent', header: 'DREB %', format: (val: number) => val?.toFixed(1) + '%', required: true },
            { key: 'oreb_percent', header: 'OREB %', format: (val: number) => val?.toFixed(1) + '%', required: false },
            { key: 'stl_percent', header: 'STL %', format: (val: number) => val?.toFixed(1) + '%', required: false },
            { key: 'blk_percent', header: 'BLK %', format: (val: number) => val?.toFixed(1) + '%', required: false }
        ];

        potentialColumns.forEach(col => {
            const benchmarkValue = apiResponse.succ_bmark[col.key as keyof typeof apiResponse.succ_bmark];
            if (benchmarkValue !== undefined) {
                baseColumns.push({
                    key: col.key,
                    header: col.header,
                    accessor: (item: SuccessTableRow) => {
                        const value = item[col.key as keyof SuccessTableRow] as number | undefined;
                        return value !== undefined ? col.format(value) : 'N/A';
                    },
                    sortable: true
                } as any);
            }
        });

        return baseColumns;
    };

    const successTableColumns = getSuccessTableColumns();

    // Create success table data
    const getSuccessTableData = (): SuccessTableRow[] => {
        const data: SuccessTableRow[] = [];

        // Add benchmark row
        if (apiResponse?.succ_bmark) {
            data.push({
                player: 'Benchmark',
                ts_percent: apiResponse.succ_bmark.ts_percent,
                porpag: apiResponse.succ_bmark.porpag,
                dporpag: apiResponse.succ_bmark.dporpag,
                ast_percent: apiResponse.succ_bmark.ast_percent,
                dreb_percent: apiResponse.succ_bmark.dreb_percent,
                oreb_percent: apiResponse.succ_bmark.oreb_percent,
                stl_percent: apiResponse.succ_bmark.stl_percent,
                blk_percent: apiResponse.succ_bmark.blk_percent
            });
        }

        // Add display player row
        if (apiResponse?.succ_plyr && displayPlayerName) {
            data.push({
                player: displayPlayerName as string,
                ts_percent: apiResponse.succ_plyr.ts_percent,
                porpag: apiResponse.succ_plyr.porpag,
                dporpag: apiResponse.succ_plyr.dporpag,
                ast_percent: apiResponse.succ_plyr.ast_percent,
                dreb_percent: apiResponse.succ_plyr.dreb_percent,
                oreb_percent: apiResponse.succ_plyr.oreb_percent,
                stl_percent: apiResponse.succ_plyr.stl_percent,
                blk_percent: apiResponse.succ_plyr.blk_percent
            });
        }

        // Add comparison player row (using available stats from playerStats)
        if (playerStats?.player_stats && comparisonPlayerName) {
            data.push({
                player: comparisonPlayerName as string,
                ts_percent: playerStats.player_stats.ts_percent,
                porpag: playerStats.player_stats.porpag,
                dporpag: playerStats.player_stats.dporpag,
                ast_percent: playerStats.player_stats.ast_percent,
                dreb_percent: playerStats.player_stats.dreb_percent,
                oreb_percent: playerStats.player_stats.oreb_percent,
                stl_percent: playerStats.player_stats.stl_percent,
                blk_percent: playerStats.player_stats.blk_percent
            });
        }

        return data;
    };
    
    return (
        <ScrollView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.comparisonTitle}>
                    {displayPlayerName} vs {comparisonPlayerName}
                </Text>
            </View>

            <View>
                <Text style={styles.sectionTitle}>Fit</Text>
                <View style={styles.sectionNoteRow}>
                    <Ionicons name="document-text-outline" size={18} color="rgba(163,163,163,1)" style={styles.sectionNoteIcon} />
                    <Text style={styles.sectionNoteText}>
                        Aim to be close to the benchmark across metrics — smaller differences are better.
                    </Text>
                </View>
                {(apiResponse || playerStats) && (
                    <View style={styles.tableContainer}>
                        <DataTable 
                            columns={fitTableColumns} 
                            data={getFitTableData()} 
                            page="fit"
                            numColLeftAligned={1}
                            showSearchBar={false}
                        />
                    </View>
                )}
                {loading && (
                    <Text style={styles.statusText}>Loading fit data...</Text>
                )}
                {error && !apiResponse && (
                    <Text style={styles.errorText}>Unable to load fit data</Text>
                )}
            </View>

            <View>
                <Text style={styles.sectionTitle}>Value</Text>
                <View style={styles.sectionNoteRow}>
                    <Ionicons name="document-text-outline" size={18} color="rgba(163,163,163,1)" style={styles.sectionNoteIcon} />
                    <Text style={styles.sectionNoteText}>
                        Higher is better: positive differences from the benchmark indicate added value.
                    </Text>
                </View>
                {(apiResponse || playerStats) && (
                    <View style={styles.tableContainer}>
                        <DataTable 
                            columns={valueTableColumns} 
                            data={getValueTableData()} 
                            page="value"
                            numColLeftAligned={1}
                            showSearchBar={false}
                        />
                    </View>
                )}
                {loading && (
                    <Text style={styles.statusText}>Loading value data...</Text>
                )}
                {error && !apiResponse && (
                    <Text style={styles.errorText}>Unable to load value data</Text>
                )}
            </View>

            <View>
                <Text style={styles.sectionTitle}>Success</Text>
                <View style={styles.sectionNoteRow}>
                    <Ionicons name="document-text-outline" size={18} color="rgba(163,163,163,1)" style={styles.sectionNoteIcon} />
                    <Text style={styles.sectionNoteText}>
                        Higher is better: positive differences from the benchmark indicate stronger success.
                    </Text>
                </View>
                {(apiResponse || playerStats) && (
                    <View style={styles.tableContainer}>
                        <DataTable 
                            columns={successTableColumns} 
                            data={getSuccessTableData()} 
                            page="success"
                            numColLeftAligned={1}
                            showSearchBar={false}
                        />
                    </View>
                )}
                {loading && (
                    <Text style={styles.statusText}>Loading success data...</Text>
                )}
                {error && !apiResponse && (
                    <Text style={styles.errorText}>Unable to load success data</Text>
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
    content: {
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    comparisonTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        lineHeight: 40,
    },
    sectionTitle : {
        color: "white",
        fontSize : 32,
        paddingLeft : 20,
        fontWeight : 'bold'
    },
    statusText: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: 16,
        marginTop: 20,
        textAlign: 'center',
    },
    errorText: {
        color: '#ff6b6b',
        fontSize: 16,
        marginTop: 20,
        textAlign: 'center',
    },
    statsContainer: {
        marginTop: 20,
        padding: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 12,
        width: '100%',
        maxWidth: 400,
    },
    statsTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 16,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    statItem: {
        width: '48%',
        marginBottom: 12,
        padding: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 8,
    },
    statLabel: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: 12,
        marginBottom: 4,
    },
    statValue: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    tableContainer: {
        marginTop: 16,
        marginHorizontal: 20,
        marginBottom: 32,
    },
    sectionNoteRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 20,
        paddingRight: 20,
        marginTop: 6,
        gap: 8,
    },
    sectionNoteIcon: {
        marginRight: 8,
    },
    sectionNoteText: {
        flex: 1,
        color: 'rgba(163, 163, 163, 1)',
        fontSize: 13,
        lineHeight: 18,
    },
});