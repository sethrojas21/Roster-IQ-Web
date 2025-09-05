import { router } from "expo-router";
import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { DataTable } from "react-native-paper";

export type HomePageRow = {
  season_year: number;
  player_name: string;
  player_id: number;
  player_year: number;
  team_name: string;
  position: string;
  height_inches: number;
};

interface TableViewProps {
  data: HomePageRow[];
}

const ROWS_PER_PAGE = [50, 100];
const YEAR_TO_CLASS: { [key: number]: string } = {
    1: "Freshman",
    2: "Sophomore",
    3: "Junior",
    4: "Senior"
}

export default function TableView({ data }: TableViewProps) {
  const [page, setPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(ROWS_PER_PAGE[0]);

  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, data.length);

  return (
    <View style={styles.container}>
      <DataTable style={styles.table}>
        <DataTable.Header style={styles.header}>
          <DataTable.Title textStyle={styles.header_text}>Name</DataTable.Title>
          <DataTable.Title textStyle={styles.header_text}>Season</DataTable.Title>
          <DataTable.Title textStyle={styles.header_text}>Position</DataTable.Title>
          <DataTable.Title textStyle={styles.header_text}>Year</DataTable.Title>
        </DataTable.Header>

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
            {data.slice(from, to).map((row) => (
            <DataTable.Row 
                key={row.player_id}
                onPress={() => {
                  router.push({
                    pathname: "/rankings",
                    params: {
                      teamName: row.team_name,
                      playerName: row.player_name,
                      seasonYear: row.season_year,
                      playerId: row.player_id
                    }
                  });
                }}
                style={styles.row}
            >
                <DataTable.Cell textStyle={styles.cell_text}>{row.player_name}</DataTable.Cell>
                <DataTable.Cell textStyle={styles.cell_text}>{row.season_year}</DataTable.Cell>
                <DataTable.Cell textStyle={styles.cell_text}>{row.position}</DataTable.Cell>
                <DataTable.Cell textStyle={styles.cell_text}>{YEAR_TO_CLASS[row.player_year] || row.player_year}</DataTable.Cell>
            </DataTable.Row>
            ))}
        </ScrollView>

        <DataTable.Pagination
          page={page}
          numberOfPages={Math.ceil(data.length / itemsPerPage)}
          onPageChange={page => setPage(page)}
          label={`${from + 1}-${to} of ${data.length}`}
          showFastPaginationControls
          numberOfItemsPerPageList={ROWS_PER_PAGE}
          numberOfItemsPerPage={itemsPerPage}
          onItemsPerPageChange={setItemsPerPage}
          selectPageDropdownLabel={'Rows per page'}
        />
      </DataTable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  table: {
    flex: 1,
  },
  header: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  header_text: {
    color: "white",
    fontSize: 20,
  },
  scrollView: {
    flex: 1,
    maxHeight: 500, // Adjust this value based on your needs
  },
  scrollContent: {
    flexGrow: 1,
  },
  row: {
    backgroundColor: 'transparent',
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    minHeight: 48,
  },
  cell_text: {
    color: "white",
    fontSize: 14,
  }
});
