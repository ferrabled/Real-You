import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Web3AuthWrapper } from "../components/web3Auth/Web3AuthWrapper";

export default function LoginTest() {
  return (
    <Web3AuthWrapper>
      <View style={styles.container}>
        <Text style={styles.text}>Logged In</Text>
      </View>
    </Web3AuthWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
