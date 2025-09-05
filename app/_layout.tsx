import Header from "@/components/header/header";
import { router } from "expo-router";
import { SafeAreaView, StyleSheet } from "react-native";
import { Slot } from "expo-router";

export default function RootLayout() {
  // Header = stuff at top that does not change
  // Slot is for stuff that does change
  return (
     <SafeAreaView style={[styles.container, styles.app]}>
        <Header onPressTesting={() => router.push("/")} /> 
        <Slot />
    </SafeAreaView>

  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  app: {
    flex: 1,
    backgroundColor: "#000", // global black background
  },
});