import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { ThemedText } from "../ThemedText";

interface ContestTopicProps {
  topic: string;
  endTime: number;
}

export const ContestTopic: React.FC<ContestTopicProps> = ({
  topic,
  endTime,
}) => {
  const formatTimeLeft = (endTime: number) => {
    const now = Math.floor(Date.now() / 1000);
    const timeLeft = endTime - now;
    if (timeLeft <= 0) return "Contest ended";
    const days = Math.floor(timeLeft / 86400);
    const hours = Math.floor((timeLeft % 86400) / 3600);
    const minutes = Math.floor((timeLeft % 3600) / 60);
    return `${days}d ${hours}h ${minutes}m left`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.topic}>{topic}</Text>
      <View style={styles.timeLeftContainer}>
        <ThemedText style={styles.timeLeft}>
          🕰️ {formatTimeLeft(endTime)}
        </ThemedText>
        <ThemedText style={styles.timeLeft}>🏆 10 reputation points</ThemedText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f0f0",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  topic: {
    fontSize: 36,
    fontStyle: "italic",
    fontWeight: "bold",
    marginBottom: 10,
  },
  timeLeft: {
    fontSize: 18,
    color: "#666",
  },
  timeLeftContainer: {
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
});
