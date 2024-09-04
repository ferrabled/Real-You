import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { ThemedText } from "./ThemedText";

export function Header() {
  const router = useRouter();

  const handlePress = () => {
    router.push("/onboarding");
  };

  return (
    <TouchableOpacity style={styles.header} onPress={handlePress}>
      <ThemedText style={styles.title}>Real You</ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 1,
    marginTop: 25,
    borderBottomColor: "#ccc",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
