import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface GradientTitleProps {
  title: string;
  teamName?: string;
  position?: string;
  seasonYear?: string;
  showMetadata?: boolean; // New prop to control whether to show the team/position/season line
}

export default function GradientTitle({ 
  title, 
  teamName, 
  position, 
  seasonYear,
  showMetadata = true
}: GradientTitleProps) {
  return (
    <View style={styles.titleBox}>
      <View>
        <LinearGradient
          colors={["#8A5CF6", "#FF5C97", "#FF7A59"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, borderRadius: 20}}
        />
        <Text style={[styles.title, { backgroundColor: 'transparent', padding: 10 }]}>
          {title}
        </Text>
      </View>

      {showMetadata && (teamName || position || seasonYear) && (
        <View style={styles.hStackContainer}>
          {teamName && <Text style={styles.subtitle}>{teamName}</Text>}
          {teamName && (position || seasonYear) && (
            <Text style={styles.bulletPoint}> - </Text>
          )}
          {position && <Text style={styles.subtitle}>{position}</Text>}
          {position && seasonYear && (
            <Text style={styles.bulletPoint}> - </Text>
          )}
          {seasonYear && <Text style={styles.subtitle}>{seasonYear}</Text>}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  titleBox: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    width: "100%",
    alignItems: "center",
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
    marginTop: 10,
    flexWrap: "wrap",
  },
  subtitle: {
    fontSize: 24,
    color: "white",
  },
  bulletPoint: {
    color: "purple",
    fontSize: 30,
  },
});