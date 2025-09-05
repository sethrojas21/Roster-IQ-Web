import { View, Text, StyleSheet } from 'react-native';
import React from 'react';

interface RankingProps {
  teamName: string;
  playerName: string;
  seasonYear: number;
  playerId: number;
}

export default function Rankings({ 
  teamName = "Arizona",
  playerName = "Caleb Love",
  seasonYear = 2024,
  playerId = 1
}: RankingProps) {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>{playerName}</Text>
          <Text style={styles.subtitle}>ID: {playerId}</Text>
        </View>
        
        <View style={styles.details}>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Team</Text>
            <Text style={styles.value}>{teamName}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.label}>Season</Text>
            <Text style={styles.value}>{seasonYear}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
  },
  details: {
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
  },
  value: {
    fontSize: 16,
    color: 'white',
  },
});