import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  name: string;
  year: string;
  team: string;
  position: string;
  /** accepts 1–4; 1=red, 2=yellow, 3=green, 4=blue (default) */
  gradientLevel?: number | string;
};

const getGradient = (level?: number | string): readonly [string, string] => {
  const n = Number(level);
  switch (n) {
    case 1: return ["#FF4E50", "#FC913A"] as const;   // red/orange
    case 2: return ["#FFD200", "#F7971E"] as const;   // yellow
    case 3: return ["#00B09B", "#96C93D"] as const;   // green
    case 4:
    default: return ["#00C6FF", "#0072FF"] as const;  // blue
  }
};

const PlayerCard: React.FC<Props> = ({
  name,
  year,
  team,
  position,
  gradientLevel = 4
}) => {
  const gradientColors = getGradient(gradientLevel);

  return (
    <LinearGradient
      colors={gradientColors}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.wrapper}
    >
      <View style={styles.card}>
        {/* Name */}
        <Text style={styles.name}>{name}</Text>

        {/* Year */}
        <Text style={styles.yearText}>{year}</Text>

        {/* Tags: Team + Position */}
        <View style={styles.tags}>
          <View style={styles.tag}>
            <Ionicons name="location-outline" size={14} color="#fff" />
            <Text style={styles.tagText}>{team}</Text>
          </View>

          <View style={styles.tag}>
            <Ionicons name="person-outline" size={14} color="#fff" />
            <Text style={styles.tagText}>{position}</Text>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 12,
    padding: 4, // gradient border
    margin: 12,
    width: 250, // adding fixed width to make cards smaller
  },
  card: {
    backgroundColor: "#1A1A1A",
    borderRadius: 10,
    padding: 16,
  },
  name: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  yearText: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 13,
    marginBottom: 12,
  },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  tagText: {
    color: "#fff",
    marginLeft: 6,
    fontSize: 13,
    minWidth: 60,
  },
});

export default PlayerCard;