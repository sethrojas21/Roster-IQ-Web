import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
  value?: string;
  onChangeText?: (t: string) => void;
  onSubmitSearch?: () => void;
  onPressTesting?: () => void;
  onPressTool?: () => void;
  activeTab?: 'testing' | 'tool' | undefined;
};

const Header: React.FC<Props> = ({
  value,
  onChangeText,
  onSubmitSearch,
  onPressTesting,
  onPressTool,
  activeTab,
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
          {/* Testing pill gradient only when active */}
          <TouchableOpacity onPress={onPressTesting} activeOpacity={0.85}>
            {activeTab === 'testing' ? (
              <LinearGradient
                colors={["#8A5CF6", "#FF5C97", "#FF7A59"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.testingPillActive}
              >
                <Ionicons name="calculator-outline" size={14} color="#fff" />
                <Text style={styles.testingTextActive}>Testing</Text>
              </LinearGradient>
            ) : (
              <View style={styles.testingPillInactive}>
                <Ionicons name="calculator-outline" size={14} color="#fff" />
                <Text style={styles.testingTextInactive}>Testing</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Tool (pencil icon pill) */}
          <TouchableOpacity onPress={onPressTool} activeOpacity={0.85}>
            {activeTab === 'tool' ? (
              <LinearGradient
                colors={["#8A5CF6", "#FF5C97", "#FF7A59"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.toolPillActive}
              >
                <Ionicons name="pencil-outline" size={14} color="#fff" />
                <Text style={styles.toolTextActive}>Tool</Text>
              </LinearGradient>
            ) : (
              <View style={styles.toolPill}>
                <Ionicons name="pencil-outline" size={14} color="#fff" />
                <Text style={styles.toolText}>Tool</Text>
              </View>
            )}
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
  testingPillActive: {
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
  testingTextActive: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
  testingPillInactive: {
    height: 30,
    borderRadius: 16,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  testingTextInactive: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
  },
  toolPill: {
    height: 30,
    borderRadius: 16,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  toolPillActive: {
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
  toolText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
  },
  toolTextActive: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
});

export default Header;