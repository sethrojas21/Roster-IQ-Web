import Header from "@/components/header/header";
import { router, Slot, usePathname } from "expo-router";
import { SafeAreaView, StyleSheet } from "react-native";
import "../global.css";

export default function RootLayout() {
  // Header = stuff at top that does not change
  // Slot is for stuff that does change
  const pathname = usePathname();
  const activeTab = pathname === '/tool' ? 'tool' : pathname === '/' ? 'testing' : undefined;
  return (
     <SafeAreaView style={[styles.container, styles.app]}>
        <Header 
          onPressTesting={() => router.push("/")} 
          onPressTool={() => router.push("/tool")} 
          activeTab={activeTab}
        /> 
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