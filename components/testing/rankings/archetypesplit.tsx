// ArchetypeSplit.tsx
import React, { useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

type Archetype = {
  label: string;
  percent: number;      // e.g., 60 = 60%
  color?: "blue" | "green" | "yellow" | "red";
};

type Props = {
  items: Archetype[];   // length 1 or 2
};

const palette: Record<NonNullable<Archetype["color"]>, string[]> = {
  red: ["#FF4E50", "#FC913A"],
  yellow: ["#FFD200", "#F7971E"],
  green: ["#00B09B", "#96C93D"],
  blue: ["#00C6FF", "#0072FF"],
};

// Fallback color order if not specified by props.
const defaultColors: Array<Archetype["color"]> = ["blue", "green"];

function normalizePercents(items: Archetype[]): Archetype[] {
  const total = items.reduce((s, x) => s + (isFinite(x.percent) ? x.percent : 0), 0) || 1;
  return items.map((x) => ({ ...x, percent: (x.percent / total) * 100 }));
}

/**
 * Clamp the visual split so extremes aren't tiny or overwhelming.
 * Ex: 90/10 still shows labels 90/10, but visuals cap to ~65/35.
 */
function clampVisualSplit(p1: number, p2: number): [number, number] {
  // Convert to ratios [0..1]
  let r1 = p1 / 100;
  let r2 = p2 / 100;

  // Bounds for the visual *majority* and *minority* segments
  const MAX_MAJ = 0.67; // ~2/3
  const MIN_MIN = 0.33; // ~1/3

  if (r1 >= r2) {
    r1 = Math.min(r1, MAX_MAJ);
    r2 = 1 - r1;
    if (r2 < MIN_MIN) {
      r2 = MIN_MIN;
      r1 = 1 - r2;
    }
  } else {
    r2 = Math.min(r2, MAX_MAJ);
    r1 = 1 - r2;
    if (r1 < MIN_MIN) {
      r1 = MIN_MIN;
      r2 = 1 - r1;
    }
  }
  return [r1, r2];
}

export default function ArchetypeSplit({ items }: Props) {
  const cleaned = useMemo(() => {
    // ensure 1–2 items, fill colors
    const base = normalizePercents(items.slice(0, 2));
    return base.map((x, i) => ({
      ...x,
      color: x.color ?? defaultColors[i] ?? "blue",
    })) as Required<Archetype>[];
  }, [items]);

  const isSingle = cleaned.length === 1;

  // majority index (for glow/highlight)
  const majorityIdx = useMemo(() => {
    if (isSingle) return 0;
    return cleaned[0].percent >= cleaned[1].percent ? 0 : 1;
  }, [cleaned, isSingle]);

  // Visual widths (clamped for 2 entries)
  const [w0, w1] = useMemo(() => {
    if (isSingle) return [1, 0];
    return clampVisualSplit(cleaned[0].percent, cleaned[1].percent);
  }, [cleaned, isSingle]);

  return (
    <View style={styles.wrapper}>
      <View style={styles.card}>
        {/* Top: bars with titles */}
        <View style={styles.row}>
          {/* Left segment */}
          <LinearGradient
            colors={palette[cleaned[0].color]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[
              styles.segment,
              {
                flex: w0,
                borderTopLeftRadius: 12,
                borderBottomLeftRadius: 12,
                // subtle glow for majority
                shadowOpacity: majorityIdx === 0 ? 0.35 : 0.15,
              },
            ]}
          >
            <Text
              numberOfLines={1}
              style={[
                styles.segTitle,
                majorityIdx === 0 ? styles.segTitleMajor : null,
              ]}
            >
              {cleaned[0].label}
            </Text>
          </LinearGradient>

          {/* Right segment (only if two) */}
          {!isSingle && (
            <LinearGradient
              colors={palette[cleaned[1].color]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[
                styles.segment,
                {
                  flex: w1,
                  borderTopRightRadius: 12,
                  borderBottomRightRadius: 12,
                  shadowOpacity: majorityIdx === 1 ? 0.35 : 0.15,
                },
              ]}
            >
              <Text
                numberOfLines={1}
                style={[
                  styles.segTitle,
                  majorityIdx === 1 ? styles.segTitleMajor : null,
                ]}
              >
                {cleaned[1].label}
              </Text>
            </LinearGradient>
          )}
        </View>

        {/* Bottom: percentages */}
        <View style={styles.percentRow}>
          <Text style={styles.percentText}>{Math.round(cleaned[0].percent)}%</Text>
          {!isSingle && (
            <Text style={styles.percentTextRight}>
              {Math.round(cleaned[1].percent)}%
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    padding: 12,
  },
  card: {
    backgroundColor: "#111214",
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255,255,255,0.07)",
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    height: 96,
  },
  segment: {
    justifyContent: "center",
    paddingHorizontal: 12,
    shadowColor: "#000",
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    // Android elevation for glow hint
    elevation: 3,
  },
  segTitle: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 16,
    fontWeight: "700",
  },
  segTitleMajor: {
    color: "#fff",
  },
  percentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(255,255,255,0.08)",
  },
  percentText: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 13,
    fontWeight: "700",
  },
  percentTextRight: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 13,
    fontWeight: "700",
    textAlign: "right",
  },
});