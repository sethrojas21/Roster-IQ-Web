"use client"

import { router } from "expo-router"
import * as React from "react"
import { Dimensions, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
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
  const [currentPage, setCurrentPage] = React.useState(1)
  const [searchQuery, setSearchQuery] = React.useState('')
  const [searchColumn, setSearchColumn] = React.useState<string>('all')
  const [showSearchDropdown, setShowSearchDropdown] = React.useState(false)
  
  const itemsPerPage = 25

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

  // Search options for dropdown
  const searchOptions = React.useMemo(() => {
    const options = [{ key: 'all', label: 'All Columns' }];
    columns.forEach(column => {
      options.push({ key: column.key, label: column.header });
    });
    return options;
  }, [columns]);

  // Filter data based on search
  const filteredData = React.useMemo(() => {
    if (!searchQuery.trim()) return data;
    
    return data.filter(item => {
      if (searchColumn === 'all') {
        // Search across all columns
        return columns.some(column => {
          const value = column.accessor(item);
          return String(value).toLowerCase().includes(searchQuery.toLowerCase());
        });
      } else {
        // Search specific column
        const column = columns.find(col => col.key === searchColumn);
        if (!column) return false;
        const value = column.accessor(item);
        return String(value).toLowerCase().includes(searchQuery.toLowerCase());
      }
    });
  }, [data, searchQuery, searchColumn, columns]);

  // Sort data
  const sortedData = React.useMemo(() => {
    if (!sortField) return filteredData;
    
    const column = allColumns.find(col => col.key === sortField);
    if (!column) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aVal = column.accessor(a);
      const bVal = column.accessor(b);
      
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortField, sortDirection, allColumns]);

  // Pagination calculations
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = sortedData.slice(startIndex, endIndex);

  // Reset to page 1 when data or search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [data.length, searchQuery, searchColumn]);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

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

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            placeholderTextColor="rgba(163, 163, 163, 0.7)"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        
        <TouchableOpacity
          style={styles.searchFilterButton}
          onPress={() => setShowSearchDropdown(!showSearchDropdown)}
        >
          <Text style={styles.searchFilterText}>
            {searchOptions.find(opt => opt.key === searchColumn)?.label || 'All'}
          </Text>
          <Text style={styles.dropdownArrow}>▼</Text>
        </TouchableOpacity>
      </View>

      {/* Search Dropdown */}
      {showSearchDropdown && (
        <>
          {/* Overlay to catch outside taps */}
          <TouchableOpacity 
            style={styles.searchDropdownOverlay}
            onPress={() => setShowSearchDropdown(false)}
            activeOpacity={1}
          />
          <View style={styles.searchDropdown}>
            <ScrollView style={styles.searchDropdownScroll} showsVerticalScrollIndicator={true}>
              {searchOptions.map(option => (
                <TouchableOpacity
                  key={option.key}
                  style={[
                    styles.searchDropdownItem,
                    searchColumn === option.key && styles.searchDropdownItemActive
                  ]}
                  onPress={() => {
                    setSearchColumn(option.key);
                    setShowSearchDropdown(false);
                  }}
                >
                  <Text style={[
                    styles.searchDropdownText,
                    searchColumn === option.key && styles.searchDropdownTextActive
                  ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </>
      )}

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
            {paginatedData.length > 0 ? (
              paginatedData.map((item, rowIndex) => (
                <TouchableOpacity
                  key={startIndex + rowIndex}
                  style={styles.dataRow}
                  onPress={() => handleRowPress(item, startIndex + rowIndex)}
                >
                  {allColumns.map((column, colIndex) => (
                    <View
                      key={`${startIndex + rowIndex}-${column.key}`}
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
                          ? (startIndex + rowIndex + 1).toString()
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

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <View style={styles.paginationContainer}>
          <TouchableOpacity
            style={[styles.paginationButton, currentPage === 1 && styles.disabledButton]}
            onPress={goToPreviousPage}
            disabled={currentPage === 1}
          >
            <Text style={[styles.paginationButtonText, currentPage === 1 && styles.disabledButtonText]}>
              ←
            </Text>
          </TouchableOpacity>

          <View style={styles.paginationInfo}>
            <Text style={styles.paginationText}>
              {startIndex + 1}-{Math.min(endIndex, sortedData.length)} of {sortedData.length}
            </Text>
            <Text style={styles.paginationPageText}>
              Page {currentPage} of {totalPages}
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.paginationButton, currentPage === totalPages && styles.disabledButton]}
            onPress={goToNextPage}
            disabled={currentPage === totalPages}
          >
            <Text style={[styles.paginationButtonText, currentPage === totalPages && styles.disabledButtonText]}>
              →
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(38, 38, 38, 0.8)',
    backgroundColor: '#030303'
  },
  headerSheen: {
    height: 4,
    backgroundColor:'rgba(23, 23, 23, 0.9)'
  },
  // Search styles
  searchContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'rgba(23, 23, 23, 0.9)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(64, 64, 64, 0.7)',
    gap: 12,
  },
  searchInputContainer: {
    flex: 1,
  },
  searchInput: {
    height: 44,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: 'rgba(229, 229, 229, 0.95)',
    borderWidth: 1,
    borderColor: 'rgba(64, 64, 64, 0.5)',
  },
  searchFilterButton: {
    height: 44,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(64, 64, 64, 0.5)',
    minWidth: 120,
  },
  searchFilterText: {
    fontSize: 14,
    color: 'rgba(229, 229, 229, 0.95)',
    fontWeight: '500',
  },
  dropdownArrow: {
    fontSize: 10,
    color: 'rgba(163, 163, 163, 1)',
  },
  searchDropdown: {
    backgroundColor: 'rgba(23, 23, 23, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(64, 64, 64, 0.7)',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: 'rgba(64, 64, 64, 0.5)',
    maxHeight: 250,
    position: 'relative',
    zIndex: 1000,
  },
  searchDropdownOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
  },
  searchDropdownScroll: {
    maxHeight: 250,
  },
  searchDropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(64, 64, 64, 0.3)',
  },
  searchDropdownItemActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  searchDropdownText: {
    fontSize: 14,
    color: 'rgba(229, 229, 229, 0.95)',
  },
  searchDropdownTextActive: {
    color: 'rgba(163, 163, 163, 1)',
    fontWeight: '600',
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
  // Pagination styles
  paginationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(23, 23, 23, 0.9)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(64, 64, 64, 0.7)',
  },
  paginationButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  paginationButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'rgba(229, 229, 229, 0.95)',
  },
  disabledButtonText: {
    color: 'rgba(163, 163, 163, 0.5)',
  },
  paginationInfo: {
    alignItems: 'center',
  },
  paginationText: {
    fontSize: 14,
    color: 'rgba(229, 229, 229, 0.95)',
    fontWeight: '500',
  },
  paginationPageText: {
    fontSize: 12,
    color: 'rgba(163, 163, 163, 1)',
    marginTop: 2,
  },
});