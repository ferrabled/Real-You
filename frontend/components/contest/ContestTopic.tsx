import React from "react";
import { View, StyleSheet } from "react-native";
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
      <ThemedText style={styles.topic}>Topic: {topic}</ThemedText>
      <ThemedText style={styles.timeLeft}>{formatTimeLeft(endTime)}</ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f0f0f0",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  topic: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  timeLeft: {
    fontSize: 16,
    color: "#666",
  },
});
