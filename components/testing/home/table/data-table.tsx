"use client"

import { router } from "expo-router"
import * as React from "react"
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { RankingsPageRow } from "../../rankings/columns"
import { HomePageRow } from "./columns"

interface Column<T> {
  key: string;
  header: string;
  accessor: (item: T) => any;
  sortable?: boolean;
  width?: number | string;
  flex?: number;
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  page: string
  showIndex?: boolean,
  numColLeftAligned?: number
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  page,
  showIndex = true,
  numColLeftAligned = 3
}: DataTableProps<T>) {
  const [sortField, setSortField] = React.useState<string | null>(null)
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('asc')
  const [screenData, setScreenData] = React.useState(Dimensions.get('window'))

  // Listen for dimension changes
  React.useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setScreenData(window)
    })

    return () => subscription?.remove()
  }, [])

  // Add index column if needed
  const allColumns = React.useMemo(() => {
    if (!showIndex) return columns;
    
    const indexColumn: Column<T> = {
      key: 'index',
      header: '#',
      accessor: () => '',
      width: 50,
    };

    return [indexColumn, ...columns];
  }, [columns, showIndex]);

  // Sort data
  const sortedData = React.useMemo(() => {
    if (!sortField) return data;
    
    const column = allColumns.find(col => col.key === sortField);
    if (!column) return data;

    return [...data].sort((a, b) => {
      const aVal = column.accessor(a);
      const bVal = column.accessor(b);
      
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortField, sortDirection, allColumns]);

  const handleSort = (columnKey: string) => {
    const column = allColumns.find(col => col.key === columnKey);
    if (!column?.sortable) return;

    if (sortField === columnKey) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(columnKey);
      setSortDirection('asc');
    }
  };

  const handleRowPress = (item: T, index: number) => {
    if (page === "rankings") {
      const rowData = item as unknown as HomePageRow;
      router.push({
        pathname: "/rankings",
        params: {
          teamName: rowData.team_name,
          playerName: rowData.player_name,
          seasonYear: rowData.season_year,
          playerId: rowData.player_id,
          position: rowData.position
        }
      });
    } else if (page === "breakdown") {
      const rowData = item as unknown as RankingsPageRow;
      router.push({
        pathname: "/breakdown",
        params: {
          player_name: rowData.player_name,
          player_id: 1
        }
      });
    }
  };

  // Calculate column widths based on current screen width
  const getColumnWidth = (column: Column<T>, index: number): number => {
    const availableWidth = screenData.width - 50; // Account for padding
    // if (typeof column.width === 'number') return column.width;
    // if (column.flex) return (column.flex / allColumns.reduce((sum, col) => sum + (col.flex || 1), 0)) * availableWidth;
    return availableWidth / allColumns.length;
  };

  return (
    <View style={styles.container}>
      {/* Header sheen */}
      <View style={styles.headerSheen} />

      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        <View style={[styles.tableContainer, { minWidth: screenData.width - 50 }]}>
          {/* Header */}
          <View style={styles.headerRow}>
            {allColumns.map((column, index) => (
              <TouchableOpacity
                key={column.key}
                style={[
                  styles.headerCell,
                  { width: getColumnWidth(column, index) }
                ]}
                onPress={() => handleSort(column.key)}
                disabled={!column.sortable}
              >
                <Text style={[
                  styles.headerText,
                  { textAlign: index < numColLeftAligned ? 'left' : 'right' }
                ]}>
                  {column.header}
                  {sortField === column.key && (
                    <Text style={styles.sortIndicator}>
                      {sortDirection === 'asc' ? ' ↑' : ' ↓'}
                    </Text>
                  )}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Body */}
          <ScrollView style={styles.bodyContainer} showsVerticalScrollIndicator={false}>
            {sortedData.length > 0 ? (
              sortedData.map((item, rowIndex) => (
                <TouchableOpacity
                  key={rowIndex}
                  style={styles.dataRow}
                  onPress={() => handleRowPress(item, rowIndex)}
                >
                  {allColumns.map((column, colIndex) => (
                    <View
                      key={`${rowIndex}-${column.key}`}
                      style={[
                        styles.dataCell,
                        { width: getColumnWidth(column, colIndex) }
                      ]}
                    >
                      <Text style={[
                        styles.cellText,
                        { textAlign: colIndex < numColLeftAligned ? 'left' : 'right' }
                      ]} numberOfLines={2}>
                        {column.key === 'index' 
                          ? (rowIndex + 1).toString()
                          : String(column.accessor(item) || '')
                        }
                      </Text>
                    </View>
                  ))}
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No results.</Text>
              </View>
            )}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(38, 38, 38, 0.8)',
    backgroundColor: '#030303',
    maxHeight: 500,
  },
  headerSheen: {
    height: 4,
    backgroundColor:'rgba(23, 23, 23, 0.9)'
  },
  tableContainer: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(23, 23, 23, 0.9)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(64, 64, 64, 0.7)',
  },
  headerCell: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    justifyContent: 'center',
    minHeight: 50,
  },
  headerText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: 'rgba(163, 163, 163, 1)',
    flexWrap: 'wrap',
  },
  sortIndicator: {
    fontSize: 12,
    color: 'rgba(163, 163, 163, 1)',
  },
  bodyContainer: {
    flex: 1,
  },
  dataRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(23, 23, 23, 0.7)',
    backgroundColor: 'transparent',
  },
  dataCell: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    justifyContent: 'center',
    minHeight: 56,
  },
  cellText: {
    fontSize: 14,
    color: 'rgba(229, 229, 229, 0.95)',
    flexWrap: 'wrap',
  },
  emptyContainer: {
    height: 96,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(64, 64, 64, 0.7)',
  },
  emptyText: {
    fontSize: 14,
    color: 'rgba(163, 163, 163, 1)',
    textAlign: 'center',
  },
});