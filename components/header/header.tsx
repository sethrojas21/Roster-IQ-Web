import React from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

type Props = {
  value?: string;
  onChangeText?: (t: string) => void;
  onSubmitSearch?: () => void;
  onPressTesting?: () => void;
  onPressTool?: () => void;
  onPressGrid?: () => void;
  onPressAbout?: () => void;
};

const Header: React.FC<Props> = ({
  value,
  onChangeText,
  onSubmitSearch,
  onPressTesting,
  onPressTool,
  onPressGrid,
  onPressAbout,
}) => {
  return (
    <SafeAreaView edges={["top"]} style={styles.safe}>
      <View style={styles.container}>
        {/* Left: Logo + brand */}
        <View style={styles.brandWrap}>
          {/* If you have an asset, replace with your starburst */}
          {/* <Image source={require("../assets/rosteriq-mark.png")} style={styles.logo} /> */}
          <Ionicons name="sparkles" size={18} color="#FF5C97" style={{ marginRight: 6 }} />
          <Text style={styles.brand}>Roster IQ</Text>
        </View>

        {/* Center: Search */}
        <View style={styles.searchWrap}>
          <Ionicons name="search" size={16} color="rgba(255,255,255,0.55)" />
          <TextInput
            value={value}
            onChangeText={onChangeText}
            placeholder="Search players"
            placeholderTextColor="rgba(255,255,255,0.55)"
            returnKeyType="search"
            onSubmitEditing={onSubmitSearch}
            style={styles.input}
          />
          {/* Optional: ⌘K hint */}
          <View style={styles.kbd}>
            <Text style={styles.kbdText}>⌘K</Text>
          </View>
        </View>

        {/* Right: Actions */}
        <View style={styles.actions}>
          {/* Testing (gradient pill) */}
          <TouchableOpacity onPress={onPressTesting} activeOpacity={0.85}>
            <LinearGradient
              colors={["#8A5CF6", "#FF5C97", "#FF7A59"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.testingPill}
            >
              <Ionicons name="chatbubble-ellipses-outline" size={14} color="#fff" />
              <Text style={styles.testingText}>Testing</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Tool icon */}
          <TouchableOpacity onPress={onPressTool} style={styles.iconBtn} hitSlop={8}>
            <MaterialCommunityIcons name="toolbox-outline" size={20} color="rgba(255,255,255,0.85)" />
          </TouchableOpacity>

          {/* Grid icon */}
          <TouchableOpacity onPress={onPressGrid} style={styles.iconBtn} hitSlop={8}>
            <Ionicons name="grid-outline" size={20} color="rgba(255,255,255,0.85)" />
          </TouchableOpacity>

          {/* About link */}
          <TouchableOpacity onPress={onPressAbout} hitSlop={8}>
            <Text style={styles.about}>About</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    backgroundColor: "#0F0F10",
  },
  container: {
    height: 56,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(255,255,255,0.06)",
  },
  brandWrap: {
    flexDirection: "row",
    alignItems: "center",
    minWidth: 110,
  },
  logo: {
    width: 18,
    height: 18,
    marginRight: 6,
  },
  brand: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.2,
  },
  searchWrap: {
    flex: 1,
    marginHorizontal: 10,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.06)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    gap: 8,
  },
  input: {
    flex: 1,
    color: "#FFFFFF",
    paddingVertical: 0,
    fontSize: 14,
  },
  kbd: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  kbdText: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 10,
    fontWeight: "600",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  testingPill: {
    height: 30,
    borderRadius: 16,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    shadowColor: "#FF5C97",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  testingText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
  iconBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  about: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 13,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
});

export default Header;